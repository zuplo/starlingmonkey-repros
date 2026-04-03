// Bug: wasi:random traps during Wizer pre-initialization
// This file shows all three variants that trigger the trap.

// ============================================================
// Variant 1: crypto.randomUUID()
// ============================================================
try {
  const id = crypto.randomUUID();
  console.log("randomUUID succeeded:", id);
} catch (e) {
  console.error("randomUUID failed:", e.message);
}

// ============================================================
// Variant 2: crypto.getRandomValues()
// ============================================================
try {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  console.log("getRandomValues succeeded:", Array.from(arr));
} catch (e) {
  console.error("getRandomValues failed:", e.message);
}

// ============================================================
// Variant 3: Math.random()
// ============================================================
try {
  const r = Math.random();
  console.log("Math.random succeeded:", r);
} catch (e) {
  console.error("Math.random failed:", e.message);
}

addEventListener("fetch", (event) => {
  event.respondWith(new Response("If you see this, randomness worked at top level."));
});
