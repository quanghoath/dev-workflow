"use strict";

const SEED = [
  { id: 1, name: "Espresso beans 250 g", price: 9, stock: 5 },
  { id: 2, name: "Ceramic mug", price: 12, stock: 3 },
  { id: 3, name: "Limited grinder", price: 89, stock: 1 },
];

const tick = () => new Promise((r) => setTimeout(r, 5)); // simulates a database round trip

function createStore() {
  let products = [];
  let orders = [];
  let nextId = 1;

  function reset() {
    products = SEED.map((p) => ({ ...p }));
    orders = [];
    nextId = 1;
  }

  async function placeOrder(items) {
    // Step 1: check stock (read)
    for (const { productId, qty } of items) {
      const p = products.find((x) => x.id === productId);
      if (!p) return { error: "Unknown product", productId };
      await tick();
      if (p.stock < qty) return { error: `${p.name} is out of stock`, productId };
    }
    // Step 2: decrement stock (write) — a separate step, so concurrent orders can both pass step 1
    for (const { productId, qty } of items) {
      await tick();
      products.find((x) => x.id === productId).stock -= qty;
    }
    const total = items.reduce((sum, { productId, qty }) => sum + products.find((x) => x.id === productId).price * qty, 0);
    const order = { id: nextId++, status: "PENDING", items, total };
    orders.push(order);
    return order;
  }

  reset();
  return {
    reset,
    placeOrder,
    products: () => products.map((p) => ({ ...p })),
    orders: () => orders.slice(),
  };
}

module.exports = { createStore };
