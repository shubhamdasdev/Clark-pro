(module
  (import "clark:host/process" "spawn" (func $spawn (result i32)))
  (func (export "run") (result i32)
    (call $spawn)))
