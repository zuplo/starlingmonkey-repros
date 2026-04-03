# Repro 1: wasi:random traps during Wizer pre-init

## Bug

Any use of `crypto.randomUUID()`, `crypto.getRandomValues()`, or `Math.random()` at the top level (module scope) causes a trap during Wizer pre-initialization because `wasi:random` is not available during the snapshot phase.

## Expected Behavior (per web spec)

Top-level calls to `crypto.randomUUID()`, `crypto.getRandomValues()`, and `Math.random()` should succeed and return random values. In a pre-init/snapshot model, the runtime should either:

1. Defer random calls to runtime, or
2. Provide a stub implementation during pre-init that is replaced at runtime, or
3. Seed a PRNG during pre-init that is re-seeded at runtime.

## Actual Behavior (StarlingMonkey/Spin)

The component traps immediately during Wizer pre-initialization with an error like:

```
Error: failed to run wizer: wasi:random/random@0.2.0 is not available during pre-initialization
```

The component never starts.

## Files

- `app.js` — Minimal repro using `crypto.randomUUID()` at top level
- `app-variants.js` — Shows all three variants (randomUUID, getRandomValues, Math.random)

## Impact on Zuplo

Many libraries and frameworks generate unique IDs, correlation tokens, or nonces at module load time. This forces all randomness to be lazily initialized inside request handlers, which is not always feasible when using third-party code.

## Suggested Fix

StarlingMonkey should provide a stub or deferred implementation of `wasi:random` during the Wizer snapshot phase. Options:

1. Buffer random calls and replay them at runtime (Wizer's `--allow-wasi` approach).
2. Use a deterministic placeholder during pre-init and reseed at runtime.
3. Allow `wasi:random` to be available during pre-init (requires Wizer configuration).

See also: https://github.com/nicolo-ribaudo/tc39-proposal-defer-import-eval for deferred evaluation patterns.
