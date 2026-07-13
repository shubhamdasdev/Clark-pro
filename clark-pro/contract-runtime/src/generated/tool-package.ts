/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: contracts/schemas/tool-package.schema.json
 * Source SHA-256: 6a9eca39f02c643113882d4604c4d1d6ebb05e790b65c80f34064b8029f20011
 * Generator: json-schema-to-typescript@15.0.4
 */

export type ClarkGovernedToolPackage = {
  [k: string]: unknown | undefined;
} & {
  $schema: "https://schemas.clark.pro/v1/tool-package.schema.json";
  schemaVersion: 1;
  id: string;
  name: string;
  description: string;
  revision: string;
  publisher: {
    id: string;
    name: string;
    trust: "bundled_verified" | "verified" | "community_unverified" | "local_development";
    website: string;
  };
  source: {
    kind: "git" | "release_archive" | "package_registry" | "bundled" | "local";
    uri: string;
    revision: string;
    immutableRef: boolean;
    contentHash: string;
    hashBasis: "git_archive" | "release_asset" | "package_tarball" | "directory_tree";
    treeRevision?: string;
    observedAt: string;
    evidenceUri: string;
    subdirectory?: string;
  };
  license: {
    spdxExpression: string;
    declaredByUpstream: boolean;
    /**
     * @minItems 1
     */
    noticeFiles: [
      {
        path: string;
        contentHash: string;
      },
      ...{
        path: string;
        contentHash: string;
      }[]
    ];
    commercialUse: "approved" | "review_required" | "forbidden" | "not_applicable";
    redistribution: "approved" | "review_required" | "forbidden" | "not_applicable";
    dependencyReview: "pending" | "passed" | "failed" | "not_applicable";
    trademarkReview: "not_required" | "separate_review_required" | "passed" | "failed";
    reviewedAt?: string;
    reviewerRef?: string;
  };
  supplyChain: {
    sbom: {
      status: "pending" | "generated" | "verified" | "failed" | "not_applicable";
      format?: "spdx_json" | "cyclonedx_json";
      location?: string;
      contentHash?: string;
    };
    vulnerabilityScan: {
      result: "not_run" | "pass" | "fail";
      tool?: string;
      observedAt?: string;
      reportHash?: string;
    };
    signature: {
      status: "not_available" | "not_applicable" | "verified" | "failed";
      scheme?: string;
      identity?: string;
    };
    provenance: {
      status: "source_only" | "generated" | "verified" | "failed" | "not_applicable";
      attestationRef?: string;
      contentHash?: string;
    };
    build: {
      reproducibility: "unknown" | "best_effort" | "reproducible" | "not_applicable";
      networkPolicy: "offline" | "pinned_registries" | "declared_domains" | "not_applicable";
      recipeRef?: string | null;
      toolchainLockHash?: string;
    };
  };
  install: {
    mode:
      | "none_until_ready"
      | "remote_service"
      | "verified_release"
      | "build_from_source"
      | "system_dependency"
      | "user_supplied"
      | "bundled";
    requiresAdmin: boolean;
    declaredNetworkDomains: string[];
    artifacts: {
      id: string;
      platform: "macos" | "remote" | "portable";
      architecture: "arm64" | "x64" | "universal" | "wasm32" | "not_applicable";
      kind: "binary" | "app_bundle" | "wasm_component" | "library" | "configuration" | "license_notice" | "sbom";
      location: string;
      contentHash: string;
      executable: boolean;
      signatureStatus: "not_available" | "not_applicable" | "verified" | "failed";
    }[];
    updatePolicy: {
      mode: "manual_review" | "verified_candidate_channel" | "disabled";
      allowUnreviewed: false;
      permissionDiffRequired: true;
      migrationPreviewRequired: boolean;
      rollbackRequired: true;
    };
  };
  integration: {
    preferredPath: IntegrationPath;
    /**
     * @minItems 1
     */
    ladder: [IntegrationPath, ...IntegrationPath[]];
    forkPolicy: "never" | "security_patch_only" | "upstream_interface_exhausted" | "maintainer_rejected_extension";
    degradedPathApproval: null | {
      path: "browser_automation" | "forked_vendor";
      reason: string;
      ownerRole: string;
      decisionId: string;
      expiresAt: string;
    };
    canonicalBoundary: {
      /**
       * @minItems 1
       */
      clarkOwns: [
        (
          | "creator_context"
          | "workflow_state"
          | "approvals"
          | "permissions"
          | "provenance"
          | "artifact_lineage"
          | "publication_intent"
          | "memory"
          | "skills"
        ),
        ...(
          | "creator_context"
          | "workflow_state"
          | "approvals"
          | "permissions"
          | "provenance"
          | "artifact_lineage"
          | "publication_intent"
          | "memory"
          | "skills"
        )[]
      ];
      toolOwns: string[];
      stateSync:
        "none_until_ready" | "typed_commands_and_receipts" | "file_conversion" | "observation_and_reconciliation";
      externalSchemaIsCanonical: false;
    };
    interfaceRequirement: "any_stable" | "all_stable" | "none";
    interfaceCandidates: {
      id: string;
      kind: "mcp" | "headless_cli" | "http_api" | "library_api" | "plugin_api" | "wasm_component" | "file_format";
      status: "missing" | "planned" | "experimental" | "stable" | "deprecated";
      version?: string;
      evidenceUri: string;
      blocker: string | null;
    }[];
    adapters: {
      id: string;
      revision: string;
      path: IntegrationPath;
      status: "proposed" | "quarantined" | "verified" | "disabled";
      executionBoundary:
        "harness_managed" | "wasm_sandbox" | "isolated_sidecar" | "isolated_browser" | "external_app_handoff";
      entrypointRef: string;
      contentHash: string;
      /**
       * @minItems 1
       */
      capabilityRevisions: [RevisionRef, ...RevisionRef[]];
    }[];
  };
  components: {
    capabilityRevisions: RevisionRef[];
    skillRevisions: RevisionRef[];
    converters: {
      id: string;
      revision: string;
      direction: "import" | "export" | "bidirectional";
      inputSchemaRef: string;
      outputSchemaRef: string;
      lossPolicy: "lossless" | "declared_loss" | "reject_unsupported";
      contentHash: string;
    }[];
    uiContributions: {
      [k: string]: unknown | undefined;
    }[];
  };
  /**
   * @minItems 1
   */
  tests: [
    {
      id: string;
      kind:
        | "source_integrity"
        | "license"
        | "sbom"
        | "vulnerability"
        | "install"
        | "activation"
        | "capability"
        | "converter"
        | "ui_isolation"
        | "upgrade"
        | "rollback"
        | "upstream_readiness";
      automation: "executable" | "shared_contract" | "planned";
      fixture: string;
      expected: "pass" | "deny" | "quarantine" | "block";
      result: "pass" | "fail" | "blocked" | "not_run";
    },
    ...{
      id: string;
      kind:
        | "source_integrity"
        | "license"
        | "sbom"
        | "vulnerability"
        | "install"
        | "activation"
        | "capability"
        | "converter"
        | "ui_isolation"
        | "upgrade"
        | "rollback"
        | "upstream_readiness";
      automation: "executable" | "shared_contract" | "planned";
      fixture: string;
      expected: "pass" | "deny" | "quarantine" | "block";
      result: "pass" | "fail" | "blocked" | "not_run";
    }[]
  ];
  lifecycle: {
    state: "discovered" | "blocked_upstream" | "quarantined" | "testing" | "active" | "suspended" | "rolled_back";
    installed: boolean;
    trustBasis:
      | "source_review_pending"
      | "source_reviewed"
      | "signed_release"
      | "sandbox_verified"
      | "bundled_verified"
      | "developer_mode";
    rollbackRevision: string | null;
    statusReason: string;
  };
  compatibility: {
    clarkApi: string;
    /**
     * @minItems 1
     */
    platforms: ["macos-arm64" | "macos-x64", ...("macos-arm64" | "macos-x64")[]];
    upstreamRevision: string;
  };
  /**
   * @minItems 1
   */
  limitations: [string, ...string[]];
  extensions?: Extensions;
};
/**
 * This interface was referenced by `undefined`'s JSON-Schema
 * via the `definition` "integrationPath".
 */
export type IntegrationPath =
  | "mcp"
  | "headless_cli"
  | "http_api"
  | "library"
  | "wasm_component"
  | "local_sidecar"
  | "file_handoff"
  | "browser_automation"
  | "forked_vendor";

export interface RevisionRef {
  id: string;
  revision: string;
  contentHash?: string;
}
export interface Extensions {}
