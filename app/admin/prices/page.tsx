//app/admin/prices/page.tsx

"use client";

import { useEffect, useState } from "react";

interface Vehicle { id: number; name: string; }
interface Price {
  id: number;
  fromZone: string;
  toZone: string;
  vehicleId: number;
  oneWay: number;
  roundTrip: number;
  vehicle?: Vehicle;
}

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({
    fromZone: "", toZone: "", vehicleId: "", oneWay: "", roundTrip: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    const [pricesRes, vehiclesRes] = await Promise.all([
      fetch("/api/prices"),
      fetch("/api/vehicles")
    ]);
    setPrices(await pricesRes.json());
    setVehicles(await vehiclesRes.json());
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ fromZone: "", toZone: "", vehicleId: "", oneWay: "", roundTrip: "" });
  };

  const handleSubmit = async () => {
    if (!form.fromZone || !form.toZone || !form.vehicleId || !form.oneWay || !form.roundTrip) return alert("All fields required");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/prices/${editingId}` : "/api/prices";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    resetForm();
    loadData();
  };

  const startEdit = (price: Price) => {
    setEditingId(price.id);
    setForm({
      fromZone: price.fromZone,
      toZone: price.toZone,
      vehicleId: String(price.vehicleId),
      oneWay: String(price.oneWay),
      roundTrip: String(price.roundTrip)
    });
  };

  const deletePrice = async (id: number) => {
    if (!confirm("Delete price?")) return;
    await fetch(`/api/prices/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Prices</h1>
      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-5 gap-3">
        <input placeholder="From Zone (slug)" value={form.fromZone} onChange={e => setForm({...form, fromZone: e.target.value})} className="border p-2 rounded" />
        <input placeholder="To Zone (slug)" value={form.toZone} onChange={e => setForm({...form, toZone: e.target.value})} className="border p-2 rounded" />
        <select value={form.vehicleId} onChange={e => setForm({...form, vehicleId: e.target.value})} className="border p-2 rounded">
          <option value="">Select Vehicle</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <input type="number" placeholder="One Way (USD)" value={form.oneWay} onChange={e => setForm({...form, oneWay: e.target.value})} className="border p-2 rounded" />
        <input type="number" placeholder="Round Trip (USD)" value={form.roundTrip} onChange={e => setForm({...form, roundTrip: e.target.value})} className="border p-2 rounded" />
        <div className="flex gap-2 col-span-5">
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Create"}</button>
          {editingId && <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
        </div>
      </div>
      <div className="space-y-3">
        {prices.map(price => (
          <div key={price.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <div><strong>{price.fromZone}</strong> → <strong>{price.toZone}</strong></div>
              <div>Vehicle: {price.vehicle?.name} | One way: ${price.oneWay} | Round trip: ${price.roundTrip}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(price)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => deletePrice(price.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}