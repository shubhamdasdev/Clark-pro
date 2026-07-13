/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/capability-manifest.schema.json
 * Source SHA-256: cbbcda1163f6331d31eac8c48c739df0291c9c1b6702f4138a126dc762c02fb8
 * Generator: json-schema-to-typescript@15.0.4
 */

/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "transport".
 */
export type Transport =
  | {
      type: "mcp";
      /**
       * @minItems 1
       */
      modes: ["stdio" | "streamable_http", ...("stdio" | "streamable_http")[]];
      serverRef: string;
      toolName?: string;
    }
  | {
      type: "http_api";
      baseOrigin: string;
      authScheme: "none" | "oauth_pkce" | "api_key_broker" | "delegated_token";
    }
  | {
      type: "local_process";
      executableRef: string;
      argvTemplate: string[];
      cwdPolicy: "isolated_temp" | "project_assets_readonly" | "explicit_project_write";
    }
  | {
      type: "library";
      moduleRef: string;
    }
  | {
      type: "browser";
      /**
       * @minItems 1
       */
      allowedOrigins: [string, ...string[]];
      profilePolicy: "isolated" | "user_confirmed_session";
    };

export interface ClarkCapabilityManifest {
  $schema?: string;
  schemaVersion: 1;
  id: string;
  name: string;
  description?: string;
  version: string;
  publisher: {
    id: string;
    name: string;
    source: string;
    sourceRevision: string;
    sourceHash: string;
    signature?: string;
  };
  kind: "read" | "generation" | "transformation" | "observation" | "mutation" | "publication" | "reconciliation";
  transport: Transport;
  inputSchemaRef: string;
  outputSchemaRef: string;
  /**
   * @minItems 2
   */
  lifecycle: [
    "auth" | "discover" | "validate" | "quote" | "execute" | "observe" | "cancel" | "reconcile" | "health" | "revoke",
    "auth" | "discover" | "validate" | "quote" | "execute" | "observe" | "cancel" | "reconcile" | "health" | "revoke",
    ...(
      "auth" | "discover" | "validate" | "quote" | "execute" | "observe" | "cancel" | "reconcile" | "health" | "revoke"
    )[]
  ];
  permissions: Permissions;
  egress: Egress;
  async: Async;
  idempotency: Idempotency;
  cost: Cost;
  reliability: Reliability;
  ui: {
    renderer: string;
    previewSafe: boolean;
    supportsProgress?: boolean;
    supportsDiff?: boolean;
  };
  limitations: {
    code: string;
    description: string;
    fallback: "none" | "alternate_capability" | "assisted" | "export" | "manual";
  }[];
  extensions?: Extensions;
}
/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "permissions".
 */
export interface Permissions {
  actionClass:
    | "read"
    | "capture"
    | "decision_record"
    | "artifact_approve"
    | "research"
    | "local_transform"
    | "model_generate"
    | "media_generate"
    | "external_write"
    | "social_publish"
    | "account_manage"
    | "memory_mutate"
    | "skill_mutate"
    | "policy_override"
    | "destructive";
  systemScopes: string[];
  credentialScopes: string[];
  networkDomains: string[];
  fileAccess: "none" | "explicit_inputs_readonly" | "isolated_temp" | "project_assets_write";
  requiresUserPresence: boolean;
}
/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "egress".
 */
export interface Egress {
  maximumSensitivity: "public" | "workspace" | "personal" | "confidential" | "secret_reference";
  declaredFields: string[];
  retentionPolicy: "none" | "transient" | "provider_declared" | "unknown";
  trainingPolicy: "not_used" | "opt_out_configured" | "provider_declared" | "unknown";
  region?: string;
}
/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "async".
 */
export interface Async {
  mode: "sync" | "stream" | "job" | "task";
  cancellable: boolean;
  observable: boolean;
  reconnectByExternalId: boolean;
}
/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "idempotency".
 */
export interface Idempotency {
  strategy: "not_applicable" | "provider_key" | "clark_intent_ledger" | "provider_key_and_ledger";
  reconciliation: "not_required" | "observe_provider" | "manual_check" | "export_only";
}
/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "cost".
 */
export interface Cost {
  quoteSupport: "exact" | "bounded" | "estimate" | "none";
  metering: "none" | "tokens" | "duration" | "job" | "provider_reported" | "mixed";
  currency?: string;
}
/**
 * This interface was referenced by `ClarkCapabilityManifest`'s JSON-Schema
 * via the `definition` "reliability".
 */
export interface Reliability {
  timeoutSeconds: number;
  retryPolicy: "never" | "safe_transient_only" | "idempotent_only";
  maxAttempts: number;
  healthCheck: "none" | "passive" | "non_mutating_active";
  schemaDriftBehavior: "block" | "degrade_readonly" | "require_review";
}
export interface Extensions {}
