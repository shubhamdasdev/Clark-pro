(module
  (import "clark:host/secrets" "raw-credential" (func $raw_credential (result i32)))
  (func (export "run") (result i32)
    (call $raw_credential)))
