import type * as Contracts from "@clark/contract-runtime/generated";

type EventSchemaVersion = Contracts.DomainEvent.ClarkDomainEventEnvelope["schemaVersion"];
type RunSchemaVersion = Contracts.RunPlan.ClarkCompiledRunPlan["schemaVersion"];
type SkillExecutionClass = Contracts.SkillPackage.ClarkGovernedAgentSkillPackage["executionClass"];
type ToolPackLifecycle = Contracts.ToolPackage.ClarkGovernedToolPackage["lifecycle"]["state"];

const eventSchemaVersion: EventSchemaVersion = 1;
const runSchemaVersion: RunSchemaVersion = 1;
const skillClass: SkillExecutionClass = "B";
const toolPackLifecycle: ToolPackLifecycle = "blocked_upstream";

void [eventSchemaVersion, runSchemaVersion, skillClass, toolPackLifecycle];
