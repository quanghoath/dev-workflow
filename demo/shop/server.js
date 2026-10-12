// Tiny demo shop for recording dev-workflow. No dependencies: `node server.js`.
// It contains two deliberate bugs for the demo:
//   1. The "Place order" button can be double-clicked and creates two orders.
//   2. Stock is checked and decremented in two steps (read-then-write), so concurrent orders can oversell.
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { createStore } = require("./store");

const store = createStore();
const PORT = Number(process.env.PORT) || 3000;

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        resolve(null);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/cart")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "public", "index.html")));
  }
  if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true });
  if (req.method === "GET" && req.url === "/api/products") return send(res, 200, store.products());
  if (req.method === "GET" && req.url === "/api/orders") return send(res, 200, store.orders());
  if (req.method === "POST" && req.url === "/api/reset") {
    store.reset();
    return send(res, 200, { ok: true });
  }
  if (req.method === "POST" && req.url === "/api/orders") {
    const body = await readJson(req);
    if (!body || !Array.isArray(body.items) || body.items.length === 0) return send(res, 400, { error: "Cart is empty" });
    const result = await store.placeOrder(body.items);
    if (result.error) return send(res, 409, result);
    return send(res, 201, result);
  }
  send(res, 404, { error: "Not found" });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Demo shop on http://localhost:${PORT}/cart`));
}
module.exports = { server, store };
