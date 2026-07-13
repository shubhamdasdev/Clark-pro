import type * as Contracts from "@clark/contract-runtime/generated";

type EventSchemaVersion = Contracts.DomainEvent.ClarkDomainEventEnvelope["schemaVersion"];
type RunSchemaVersion = Contracts.RunPlan.ClarkCompiledRunPlan["schemaVersion"];
type SkillExecutionClass = Contracts.SkillPackage.ClarkGovernedAgentSkillPackage["executionClass"];

const eventSchemaVersion: EventSchemaVersion = 1;
const runSchemaVersion: RunSchemaVersion = 1;
const skillClass: SkillExecutionClass = "B";

void [eventSchemaVersion, runSchemaVersion, skillClass];
