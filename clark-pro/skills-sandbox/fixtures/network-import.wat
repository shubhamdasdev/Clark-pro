(module
  (import "wasi:sockets/tcp@0.2.0" "start-connect" (func $connect (result i32)))
  (func (export "run") (result i32)
    (call $connect)))
