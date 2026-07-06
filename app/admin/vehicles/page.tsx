//app/admin/vehicles/page.tsx

"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";

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
      <AdminHeader section="Vehículos" />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tipos de vehículo</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los vehículos disponibles y su capacidad.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {editingId ? "Editar vehículo" : "Agregar vehículo"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Nombre *</label>
              <input
                type="text"
                placeholder="e.g., SUV, VAN, SPRINTER"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Capacidad (pasajeros) *</label>
              <input
                type="number"
                placeholder="Max passengers"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 pb-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-teal-600"
                />
                <span className="text-sm text-gray-700">Activo</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista de vehículos */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Vehículos ({vehicles.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{vehicle.name}</span>
                    {!vehicle.active && (
                      <span className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Capacidad: {vehicle.capacity} pasajeros</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(vehicle)}
                    className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && (
              <p className="text-center text-gray-400 py-12">
                No hay vehículos todavía. Crea uno arriba.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}