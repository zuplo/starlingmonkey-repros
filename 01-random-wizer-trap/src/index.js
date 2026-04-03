// This should trap during Wizer pre-initialization
const id = crypto.randomUUID();

addEventListener("fetch", (event) => {
  event.respondWith(new Response(`ID: ${id}`));
});
