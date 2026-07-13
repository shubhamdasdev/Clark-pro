# Negative Contract Fixtures

Each file is deliberately invalid. A conforming validator must reject it for the named primary reason.

| Fixture | Expected rejection |
|---|---|
| `raw-secret.capability.invalid.json` | Capability manifest contains forbidden undeclared `apiKey`; raw secrets have no schema path. |
| `missing-output-schema.capability.invalid.json` | Capability does not declare `outputSchemaRef`. |
| `fractional-money.project.invalid.json` | Cost uses a floating `micros` value; currency is integer micros only. |
| `unknown-event.semantic-invalid.json` | Envelope shape is valid, but `eventType` is absent from the event catalog. |
| `dangling-edge.project.semantic-invalid.json` | Edge endpoint does not resolve to a fixture object. |
| `publish-without-reconciliation.loop.semantic-invalid.json` | Social publish operator lacks semantic idempotency/reconciliation safety even though its JSON shape is otherwise valid. |

The last three require semantic conformance checks beyond ordinary JSON Schema validation.
