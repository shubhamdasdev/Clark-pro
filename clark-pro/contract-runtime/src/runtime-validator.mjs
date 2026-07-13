import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { eventCatalogPath, schemaDirectory } from "@clark/contracts/paths";

const SCHEMA_BASE = "https://schemas.clark.pro/v1/";

function formatErrors(errors) {
  return (errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
}

export class ContractValidationError extends Error {
  constructor(contract, errors) {
    super(`${contract} validation failed: ${formatErrors(errors)}`);
    this.name = "ContractValidationError";
    this.code = "invalid_request";
    this.contract = contract;
    this.validationErrors = structuredClone(errors ?? []);
  }
}

export function createContractValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const schemaFiles = fs.readdirSync(schemaDirectory).filter((name) => name.endsWith(".json")).sort();
  for (const filename of schemaFiles) {
    ajv.addSchema(JSON.parse(fs.readFileSync(path.join(schemaDirectory, filename), "utf8")));
  }

  const catalog = JSON.parse(fs.readFileSync(eventCatalogPath, "utf8"));
  const catalogByType = new Map(catalog.events.map((entry) => [entry.eventType, entry]));

  const validateSchema = (filename, value) => {
    const validator = ajv.getSchema(`${SCHEMA_BASE}${filename}`);
    if (!validator) throw new Error(`Canonical schema is unavailable: ${filename}`);
    if (!validator(value)) throw new ContractValidationError(filename, validator.errors);
    return value;
  };

  const validateRef = (schemaRef, value) => {
    const validator = ajv.getSchema(schemaRef);
    if (!validator) throw new Error(`Canonical schema reference is unavailable: ${schemaRef}`);
    if (!validator(value)) throw new ContractValidationError(schemaRef, validator.errors);
    return value;
  };

  const validateDomainEvent = (event) => {
    validateSchema("domain-event.schema.json", event);
    const catalogEntry = catalogByType.get(event.eventType);
    if (!catalogEntry) throw new ContractValidationError("event-catalog", [{ instancePath: "/eventType", message: "is not registered" }]);
    if (catalogEntry.schemaVersion !== event.schemaVersion) {
      throw new ContractValidationError("event-catalog", [{ instancePath: "/schemaVersion", message: "does not match the registered event revision" }]);
    }
    if (catalogEntry.aggregateType !== event.aggregate.type) {
      throw new ContractValidationError("event-catalog", [{ instancePath: "/aggregate/type", message: "does not match the registered aggregate" }]);
    }
    const fragment = catalogEntry.payloadRef.split("#")[1];
    const payloadValidator = ajv.getSchema(`${SCHEMA_BASE}event-payloads.schema.json#${fragment}`);
    if (!payloadValidator?.(event.payload)) throw new ContractValidationError(`${event.eventType} payload`, payloadValidator?.errors);
    return event;
  };

  return Object.freeze({
    schemaCount: schemaFiles.length,
    eventTypeCount: catalog.events.length,
    validateSchema,
    validateRef,
    validateHarnessMessage: (message) => validateSchema("harness-ipc.schema.json", message),
    validateRunPlan: (plan) => validateSchema("run-plan.schema.json", plan),
    validateLoopDefinition: (loop) => validateSchema("loop-definition.schema.json", loop),
    validateCapabilityManifest: (manifest) => validateSchema("capability-manifest.schema.json", manifest),
    validateCapabilityRuntime: (record) => validateSchema("capability-runtime.schema.json", record),
    validateToolPackage: (toolPackage) => validateSchema("tool-package.schema.json", toolPackage),
    validateSkillPackage: (skillPackage) => validateSchema("skill-package.schema.json", skillPackage),
    validateDomainEvent
  });
}
