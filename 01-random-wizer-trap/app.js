// Bug: wasi:random traps during Wizer pre-initialization
//
// crypto.randomUUID(), crypto.getRandomValues(), and Math.random() all call
// into wasi:random, which is not available during the Wizer snapshot phase.
// Any top-level code that uses randomness will cause the component to trap
// before it can even start.

// --- All three of these trap during pre-init ---

// Variant 1: crypto.randomUUID()
const id = crypto.randomUUID(); // TRAPS: wasi:random not available during pre-init

// Variant 2: crypto.getRandomValues()
// const arr = new Uint8Array(16);
// crypto.getRandomValues(arr); // TRAPS

// Variant 3: Math.random()
// const r = Math.random(); // TRAPS

console.log("Generated ID:", id);

addEventListener("fetch", (event) => {
  event.respondWith(new Response(`ID: ${id}`));
});
