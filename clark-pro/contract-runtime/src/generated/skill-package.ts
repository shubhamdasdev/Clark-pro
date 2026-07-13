/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/skill-package.schema.json
 * Source SHA-256: 3e54137f6bb5ad3ce1ee95ff8c51343cf25aa82b6469337ac053d2b716f7088c
 * Generator: json-schema-to-typescript@15.0.4
 */

export type ClarkGovernedAgentSkillPackage = {
  [k: string]: unknown | undefined;
} & {
  $schema: "https://schemas.clark.pro/v1/skill-package.schema.json";
  schemaVersion: 1;
  id: string;
  name: string;
  description?: string;
  revision: string;
  source: {
    publisherId: string;
    kind: "bundled" | "registry" | "git" | "local" | "learned";
    uri: string;
    revision: string;
    contentHash: string;
    signature?: string;
  };
  executionClass: "A" | "B" | "C";
  /**
   * @minItems 1
   */
  files: [
    {
      path: string;
      role: "skill_md" | "reference" | "asset" | "template" | "component" | "wit" | "fixture" | "native_script";
      contentHash: string;
      executable: boolean;
    },
    ...{
      path: string;
      role: "skill_md" | "reference" | "asset" | "template" | "component" | "wit" | "fixture" | "native_script";
      contentHash: string;
      executable: boolean;
    }[]
  ];
  entrypoint?:
    | {
        kind: "wasm_component";
        path: string;
        contentHash: string;
        interfaceRevision: string;
        export: string;
      }
    | {
        kind: "native_process";
        path: string;
        /**
         * @maxItems 64
         */
        argv: string[];
      };
  requestedPermissions: Permissions;
  sandbox?: {
    runtime: "wasmtime";
    runtimeVersion: string;
    wasiModel: "component-preview2" | "core-preview1-ground-spike";
    /**
     * @minItems 8
     * @maxItems 8
     */
    denyByDefault: [
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports",
      "environment" | "stdin" | "terminal" | "network" | "clocks" | "random" | "filesystem" | "host_imports"
    ];
    limits: {
      fuel: number;
      epochDeadlineMs: number;
      memoryBytes: number;
      instances: number;
      tables: number;
      outputBytes: number;
      storageBytes: number;
    };
  };
  lifecycle: {
    state: "quarantined" | "testing" | "active" | "suspended" | "rolled_back";
    trustBasis: "declarative_review" | "sandbox_verified" | "bundled_signed" | "developer_mode";
    rollbackRevision: string | null;
    remoteExecutionAllowed: boolean;
  };
  /**
   * @minItems 1
   */
  tests: [
    {
      id: string;
      fixture: string;
      expected: "pass" | "deny" | "trap" | "quarantine";
    },
    ...{
      id: string;
      fixture: string;
      expected: "pass" | "deny" | "trap" | "quarantine";
    }[]
  ];
  compatibility: {
    clarkApi: string;
    /**
     * @minItems 1
     */
    platforms: ["macos-arm64" | "macos-x64", ...("macos-arm64" | "macos-x64")[]];
  };
};

/**
 * This interface was referenced by `undefined`'s JSON-Schema
 * via the `definition` "permissions".
 */
export interface Permissions {
  capabilityIds: string[];
  hostFunctions: string[];
  actionClasses: (
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
    | "destructive"
  )[];
  networkDomains: string[];
  credentialScopes: string[];
  readInputs: string[];
  writeOutputs: string[];
}
