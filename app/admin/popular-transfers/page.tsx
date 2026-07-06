// app/admin/popular-transfers/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/AdminHeader";

interface Zone {
  id: number;
  name: string;
  slug: string;
}

interface Vehicle {
  id: number;
  name: string;
  capacity: number;
}

interface PopularTransfer {
  id: number;
  zoneId: number;
  vehicleId: number;
  travelTime: string;
  sortOrder: number;
  active: boolean;
  image?: string | null;
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
    image: "", // URL de la imagen guardada
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
    setZones(zonesData.filter((z: Zone) => z.slug !== "airport"));
    setVehicles(vehiclesData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ id: "", zoneId: "", vehicleId: "", travelTime: "", sortOrder: "0", active: true, image: "" });
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!form.zoneId || !form.vehicleId || !form.travelTime) {
      alert("Zona, vehículo y tiempo de viaje son obligatorios");
      return;
    }

    let finalImage = form.image;

    // Si hay un archivo nuevo, subirlo primero
    if (imageFile) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      uploadFormData.append("section", "popular-transfers");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      setUploading(false);
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        alert(errorData.error || "Error al subir la imagen");
        return;
      }
      const uploadData = await uploadRes.json();
      finalImage = uploadData.url;
    }

    const url = "/api/admin/popular-transfers";
    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? {
          id: editingId,
          zoneId: Number(form.zoneId),
          vehicleId: Number(form.vehicleId),
          travelTime: form.travelTime,
          sortOrder: Number(form.sortOrder),
          active: form.active,
          image: finalImage,
        }
      : {
          zoneId: Number(form.zoneId),
          vehicleId: Number(form.vehicleId),
          travelTime: form.travelTime,
          sortOrder: Number(form.sortOrder),
          active: form.active,
          image: finalImage,
        };

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
      image: item.image || "",
    });
    setImageFile(null);
  };

  const deleteItem = async (id: number) => {
    if (!confirm("¿Eliminar este viaje popular?")) return;
    const res = await fetch(`/api/admin/popular-transfers?id=${id}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader section="Viajes Populares" />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Viajes Populares</h1>
          <p className="text-sm text-gray-500 mt-1">
            Destinos destacados que se muestran en la página de inicio.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
            Cargando...
          </div>
        ) : (
          <>
            {/* Formulario */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                {editingId ? "Editar" : "Agregar"} viaje popular
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Zona</label>
                  <select
                    value={form.zoneId}
                    onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  >
                    <option value="">Selecciona una zona</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Vehículo</label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  >
                    <option value="">Selecciona un vehículo</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.name} (capacidad {v.capacity})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Tiempo de viaje</label>
                  <input
                    type="text"
                    placeholder="Ej: 15 min from airport"
                    value={form.travelTime}
                    onChange={(e) => setForm({ ...form, travelTime: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Orden</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 accent-teal-600"
                  />
                  <span className="text-sm text-gray-700">Activo</span>
                </label>

                {/* Campo de imagen */}
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Imagen (opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                  {form.image && !imageFile && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Imagen actual:</p>
                      <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                  {imageFile && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Nueva imagen:</p>
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
                >
                  {uploading ? "Subiendo imagen..." : editingId ? "Actualizar" : "Crear"}
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

            {/* Lista */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Zona</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Vehículo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Tiempo de viaje</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Orden</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Activo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transfers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img src={item.image} alt={item.zone?.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.zone?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.vehicle?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.travelTime}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.sortOrder}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${item.active ? "bg-teal-50 text-teal-700 border-teal-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                          {item.active ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => startEdit(item)}
                          className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 transition mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transfers.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  No hay viajes populares. Crea uno con el formulario de arriba.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}