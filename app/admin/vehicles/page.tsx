"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: number;
  name: string;
  capacity: number;
  active: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVehicles = async () => {
    const res = await fetch("/api/vehicles");
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", capacity: "", active: true });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.capacity) {
      alert("Name and capacity are required");
      return;
    }

    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/vehicles/${editingId}` : "/api/vehicles";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          capacity: parseInt(form.capacity),
          active: form.active,
        }),
      });

      if (!res.ok) throw new Error("Failed to save vehicle");

      resetForm();
      loadVehicles();
    } catch (error) {
      console.error(error);
      alert("Error saving vehicle");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      name: vehicle.name,
      capacity: String(vehicle.capacity),
      active: vehicle.active,
    });
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm("Delete this vehicle? All associated prices will be lost.")) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      loadVehicles();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      alert("Error deleting vehicle");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="font-semibold text-gray-900">Cabo 101 · Admin / Vehicles</span>
        </div>
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 transition">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Vehicle Types</h1>

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
              <input
                type="text"
                placeholder="e.g., SUV, VAN, SPRINTER"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Capacity (passengers) *</label>
              <input
                type="number"
                placeholder="Max passengers"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Lista de vehículos */}
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-lg">{vehicle.name}</span>
                  {!vehicle.active && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">Capacity: {vehicle.capacity} passengers</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(vehicle)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {vehicles.length === 0 && (
            <div className="text-center text-gray-400 py-8">No vehicles yet. Create one above.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Añadir Link import
import Link from "next/link";