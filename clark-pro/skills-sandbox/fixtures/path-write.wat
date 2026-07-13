(module
  (import "wasi_snapshot_preview1" "path_open" (func $path_open (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (memory (export "memory") 1)
  (data (i32.const 32) "created.txt")
  (func (export "run") (result i32)
    (call $path_open (i32.const 3) (i32.const 0) (i32.const 32) (i32.const 11) (i32.const 1) (i64.const 64) (i64.const 0) (i32.const 0) (i32.const 0))))
