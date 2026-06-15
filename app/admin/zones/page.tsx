//app/admin/zones/page.tsx

"use client";

import { useEffect, useState } from "react";

interface Zone {
  id: number;
  slug: string;
  name: string;
  latMin: number | null;
  latMax: number | null;
  lngMin: number | null;
  lngMax: number | null;
  isAirport: boolean;
}

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [form, setForm] = useState({
    slug: "", name: "", latMin: "", latMax: "", lngMin: "", lngMax: "", isAirport: false
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadZones = async () => {
    const res = await fetch("/api/zones");
    const data = await res.json();
    setZones(data);
  };

  useEffect(() => { loadZones(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ slug: "", name: "", latMin: "", latMax: "", lngMin: "", lngMax: "", isAirport: false });
  };

  const handleSubmit = async () => {
    if (!form.slug || !form.name) return alert("Slug and Name are required");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/zones/${editingId}` : "/api/zones";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    resetForm();
    loadZones();
  };

  const startEdit = (zone: Zone) => {
    setEditingId(zone.id);
    setForm({
      slug: zone.slug,
      name: zone.name,
      latMin: zone.latMin?.toString() ?? "",
      latMax: zone.latMax?.toString() ?? "",
      lngMin: zone.lngMin?.toString() ?? "",
      lngMax: zone.lngMax?.toString() ?? "",
      isAirport: zone.isAirport
    });
  };

  const deleteZone = async (id: number) => {
    if (!confirm("Delete zone?")) return;
    await fetch(`/api/zones/${id}`, { method: "DELETE" });
    loadZones();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Zones</h1>
      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-3 gap-3">
        <input placeholder="Slug (unique)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Lat Min" value={form.latMin} onChange={e => setForm({...form, latMin: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Lat Max" value={form.latMax} onChange={e => setForm({...form, latMax: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Lng Min" value={form.lngMin} onChange={e => setForm({...form, lngMin: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Lng Max" value={form.lngMax} onChange={e => setForm({...form, lngMax: e.target.value})} className="border p-2 rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isAirport} onChange={e => setForm({...form, isAirport: e.target.checked})} />
          Is Airport
        </label>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Create"}</button>
          {editingId && <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
        </div>
      </div>
      <div className="space-y-3">
        {zones.map(zone => (
          <div key={zone.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <div><strong>{zone.name}</strong> ({zone.slug})</div>
              <div className="text-sm text-gray-600">Bounds: {zone.latMin}–{zone.latMax} / {zone.lngMin}–{zone.lngMax}</div>
              <div className="text-sm">{zone.isAirport ? "✈️ Airport" : "📍 Zone"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(zone)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => deleteZone(zone.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}