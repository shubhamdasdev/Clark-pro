(module
  (import "wasi_snapshot_preview1" "environ_sizes_get"
    (func $environ_sizes_get (param i32 i32) (result i32)))
  (memory (export "memory") 1)
  (func (export "run") (result i32)
    (drop (call $environ_sizes_get (i32.const 0) (i32.const 4)))
    (i32.load (i32.const 0))))
