//app/admin/popular-transfers/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Zone { id: number; name: string; slug: string; }
interface Vehicle { id: number; name: string; capacity: number; }

interface PopularTransfer {
  id: number;
  zoneId: number;
  vehicleId: number;
  travelTime: string;
  sortOrder: number;
  active: boolean;
  zone?: Zone;
  vehicle?: Vehicle;
}

export default function PopularTransfersAdmin() {
  const [transfers, setTransfers] = useState<PopularTransfer[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({
    id: "",
    zoneId: "",
    vehicleId: "",
    travelTime: "",
    sortOrder: "0",
    active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [transfersRes, zonesRes, vehiclesRes] = await Promise.all([
      fetch("/api/admin/popular-transfers"),
      fetch("/api/zones"),
      fetch("/api/vehicles"),
    ]);
    const transfersData = await transfersRes.json();
    const zonesData = await zonesRes.json();
    const vehiclesData = await vehiclesRes.json();
    setTransfers(transfersData);
    setZones(zonesData.filter((z: Zone) => !z.isAirport)); // excluir aeropuerto
    setVehicles(vehiclesData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ id: "", zoneId: "", vehicleId: "", travelTime: "", sortOrder: "0", active: true });
  };

  const handleSubmit = async () => {
    if (!form.zoneId || !form.vehicleId || !form.travelTime) {
      alert("Zona, vehículo y tiempo de viaje son obligatorios");
      return;
    }
    const url = "/api/admin/popular-transfers";
    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { id: editingId, ...form, zoneId: Number(form.zoneId), vehicleId: Number(form.vehicleId), sortOrder: Number(form.sortOrder) }
      : { ...form, zoneId: Number(form.zoneId), vehicleId: Number(form.vehicleId), sortOrder: Number(form.sortOrder) };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      resetForm();
      loadData();
    } else {
      const error = await res.json();
      alert(error.error || "Error al guardar");
    }
  };

  const startEdit = (item: PopularTransfer) => {
    setEditingId(item.id);
    setForm({
      id: String(item.id),
      zoneId: String(item.zoneId),
      vehicleId: String(item.vehicleId),
      travelTime: item.travelTime,
      sortOrder: String(item.sortOrder),
      active: item.active,
    });
  };

  const deleteItem = async (id: number) => {
    if (!confirm("¿Eliminar este viaje popular?")) return;
    const res = await fetch(`/api/admin/popular-transfers?id=${id}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="font-semibold text-gray-900">Cabo 101 · Admin / Viajes Populares</span>
        </div>
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Volver al Dashboard</Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Viajes Populares</h1>

        {/* Formulario de creación/edición */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Editar" : "Agregar"} viaje popular</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
              <select
                value={form.zoneId}
                onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecciona una zona</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo</label>
              <select
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecciona un vehículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} (capacidad {v.capacity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de viaje</label>
              <input
                type="text"
                placeholder="Ej: 15 min from airport"
                value={form.travelTime}
                onChange={(e) => setForm({ ...form, travelTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="active" className="text-sm text-gray-700">Activo</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              {editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista de viajes populares */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo de viaje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transfers.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.zone?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.vehicle?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.travelTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.sortOrder}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.active ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => startEdit(item)} className="text-yellow-600 hover:text-yellow-800 mr-3">Editar</button>
                    <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transfers.length === 0 && (
            <div className="text-center text-gray-400 py-8">No hay viajes populares. Crea uno con el formulario de arriba.</div>
          )}
        </div>
      </div>
    </div>
  );
}