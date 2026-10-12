"use strict";
const test = require("node:test");
const assert = require("node:assert");
const { createStore } = require("./store");

test("places an order and decrements stock", async () => {
  const store = createStore();
  const order = await store.placeOrder([{ productId: 1, qty: 2 }]);
  assert.strictEqual(order.status, "PENDING");
  assert.strictEqual(store.products().find((p) => p.id === 1).stock, 3);
});

test("rejects an order when stock is too low", async () => {
  const store = createStore();
  const result = await store.placeOrder([{ productId: 3, qty: 2 }]);
  assert.match(result.error, /out of stock/);
});
