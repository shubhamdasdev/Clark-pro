import type { ClarkDomainEventEnvelope } from "../generated/domain-event.js";
import type { SourceCaptured } from "../generated/event-payloads.js";

export const CURRENT_EVENT_SCHEMA_VERSION = 1 as const;

export interface HistoricalSourceCapturedV0 {
  schemaVersion: 0;
  eventId: string;
  eventType: "source.captured";
  entityId: string;
  entityVersion: number;
  workspaceId: string;
  projectId?: string;
  happenedAt: string;
  actorId: string;
  sensitivity: "public" | "workspace" | "personal" | "confidential";
  capture: {
    versionId: string;
    sha256: string;
    kind: "text" | "url" | "file" | "screenshot" | "voice" | "selection";
    classification: "pending" | "accepted" | "inbox";
    sourceUri?: string;
  };
}

export type SourceCapturedV1 = Omit<ClarkDomainEventEnvelope, "payload"> & { payload: SourceCaptured };
export type UnknownEvent = Record<string, unknown> & { schemaVersion: number; eventType: string };
export type DestinationEventValidator = (event: Readonly<UnknownEvent>) => boolean;
type Upcaster = (event: UnknownEvent) => UnknownEvent;

const captureKind = {
  text: "text",
  url: "url",
  file: "file",
  screenshot: "screenshot",
  voice: "voice_memo",
  selection: "selected_content"
} as const;
const classification = { pending: "proposed", accepted: "confirmed", inbox: "inbox" } as const;

const sourceCapturedV0ToV1 = (input: UnknownEvent): UnknownEvent => {
  const event = input as unknown as HistoricalSourceCapturedV0;
  const contentHash = `sha256:${event.capture.sha256}`;
  const payload: SourceCaptured = {
    artifact: { artifactId: event.entityId, versionId: event.capture.versionId, contentHash },
    captureKind: captureKind[event.capture.kind],
    originalHash: contentHash,
    sensitivity: event.sensitivity,
    classificationStatus: classification[event.capture.classification],
    ...(event.capture.sourceUri ? { sourceUri: event.capture.sourceUri } : {})
  };
  const output: SourceCapturedV1 = {
    schemaVersion: 1,
    eventId: event.eventId,
    eventType: event.eventType,
    aggregate: { type: "artifact", id: event.entityId, version: event.entityVersion },
    workspaceId: event.workspaceId,
    ...(event.projectId ? { projectId: event.projectId } : {}),
    occurredAt: event.happenedAt,
    recordedAt: event.happenedAt,
    actor: { type: "creator", id: event.actorId },
    sensitivity: event.sensitivity,
    payload,
    metadata: {
      source: "import",
      extensions: { "clark.migration.source_version": 0, "clark.migration.upcaster": "source.captured@0→1" }
    }
  };
  return output as unknown as UnknownEvent;
};

const registry = new Map<string, Upcaster>([["source.captured@0", sourceCapturedV0ToV1]]);

const isUnknownEvent = (value: unknown): value is UnknownEvent => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return Number.isInteger(candidate.schemaVersion) && typeof candidate.eventType === "string";
};

export function upcastDomainEvent(input: unknown, validateDestination: DestinationEventValidator): UnknownEvent {
  if (!isUnknownEvent(input)) throw new Error("Invalid event envelope before upcasting");
  if (input.schemaVersion > CURRENT_EVENT_SCHEMA_VERSION) throw new Error(`Future event schema version ${input.schemaVersion} is unsupported`);
  let current = structuredClone(input);
  let validated = false;
  while (current.schemaVersion < CURRENT_EVENT_SCHEMA_VERSION) {
    const fromVersion = current.schemaVersion;
    const key = `${current.eventType}@${fromVersion}`;
    const upcaster = registry.get(key);
    if (!upcaster) throw new Error(`Missing upcaster ${key}`);
    const next = upcaster(current);
    if (next.eventType !== current.eventType) throw new Error(`Upcaster ${key} changed event type`);
    if (next.schemaVersion !== fromVersion + 1) throw new Error(`Upcaster ${key} did not advance exactly one version`);
    if (!validateDestination(next)) throw new Error(`Upcaster ${key} failed destination validation`);
    current = next;
    validated = true;
  }
  if (!validated && !validateDestination(current)) throw new Error(`${current.eventType}@${current.schemaVersion} failed current validation`);
  return current;
}
