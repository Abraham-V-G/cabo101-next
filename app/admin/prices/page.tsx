"use client";

import { useEffect, useState } from "react";

interface Price {
  id: number;
  fromZone: string;
  toZone: string;
  suvPrice: number;
  vanPrice: number;
  sprinterPrice: number;
}

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);

  const [fromZone, setFromZone] = useState("");
  const [toZone, setToZone] = useState("");
  const [suvPrice, setSuvPrice] = useState("");
  const [vanPrice, setVanPrice] = useState("");
  const [sprinterPrice, setSprinterPrice] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadPrices = async () => {
    const res = await fetch("/api/prices");
    const data = await res.json();
    setPrices(data);
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const resetForm = () => {
    setEditingId(null);

    setFromZone("");
    setToZone("");
    setSuvPrice("");
    setVanPrice("");
    setSprinterPrice("");
  };

  const createPrice = async () => {
    if (!fromZone || !toZone) return;

    await fetch("/api/prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromZone,
        toZone,
        suvPrice,
        vanPrice,
        sprinterPrice,
      }),
    });

    resetForm();
    loadPrices();
  };

  const deletePrice = async (id: number) => {
    if (!confirm("Delete this price?")) return;

    await fetch(`/api/prices/${id}`, {
      method: "DELETE",
    });

    loadPrices();
  };

  const startEdit = (price: Price) => {
    setEditingId(price.id);

    setFromZone(price.fromZone);
    setToZone(price.toZone);
    setSuvPrice(String(price.suvPrice));
    setVanPrice(String(price.vanPrice));
    setSprinterPrice(String(price.sprinterPrice));
  };

  const updatePrice = async () => {
    if (!editingId) return;

    await fetch(`/api/prices/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromZone,
        toZone,
        suvPrice,
        vanPrice,
        sprinterPrice,
      }),
    });

    resetForm();
    loadPrices();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Prices
      </h1>

      <div className="grid gap-3 mb-6 max-w-2xl">

        <input
          value={fromZone}
          onChange={(e) => setFromZone(e.target.value)}
          placeholder="From Zone"
          className="border rounded px-4 py-2"
        />

        <input
          value={toZone}
          onChange={(e) => setToZone(e.target.value)}
          placeholder="To Zone"
          className="border rounded px-4 py-2"
        />

        <input
          type="number"
          value={suvPrice}
          onChange={(e) => setSuvPrice(e.target.value)}
          placeholder="SUV Price"
          className="border rounded px-4 py-2"
        />

        <input
          type="number"
          value={vanPrice}
          onChange={(e) => setVanPrice(e.target.value)}
          placeholder="VAN Price"
          className="border rounded px-4 py-2"
        />

        <input
          type="number"
          value={sprinterPrice}
          onChange={(e) => setSprinterPrice(e.target.value)}
          placeholder="Sprinter Price"
          className="border rounded px-4 py-2"
        />

        {editingId ? (
          <div className="flex gap-2">
            <button
              onClick={updatePrice}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Price
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={createPrice}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Price
          </button>
        )}
      </div>

      <div className="space-y-3">

        {prices.map((price) => (
          <div
            key={price.id}
            className="border rounded p-4"
          >
            <div>
              <strong>
                {price.fromZone}
              </strong>
              {" → "}
              <strong>
                {price.toZone}
              </strong>
            </div>

            <div className="mt-2">
              SUV: ${price.suvPrice}
            </div>

            <div>
              VAN: ${price.vanPrice}
            </div>

            <div>
              Sprinter: ${price.sprinterPrice}
            </div>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => startEdit(price)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deletePrice(price.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}