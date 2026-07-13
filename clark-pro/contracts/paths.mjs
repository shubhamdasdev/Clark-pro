import { fileURLToPath } from "node:url";

export const contractPackageDirectory = fileURLToPath(new URL("./", import.meta.url));
export const schemaDirectory = fileURLToPath(new URL("./schemas/", import.meta.url));
export const eventCatalogPath = fileURLToPath(new URL("./event-catalog.json", import.meta.url));
export const harnessFixtureDirectory = fileURLToPath(new URL("./fixtures/harness/", import.meta.url));
