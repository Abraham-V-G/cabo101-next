//app/admin/popular-transfers/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Zone {
  id: number;
  name: string;
  slug: string;
  isPopular: boolean;
  travelTimeFromAirport: string | null;
  sortOrder: number;
}

export default function PopularTransfersAdmin() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadZones = async () => {
    const res = await fetch("/api/admin/popular-transfers");
    const data = await res.json();
    setZones(data);
    setLoading(false);
  };

  useEffect(() => {
    loadZones();
  }, []);

  const updateZone = (id: number, field: keyof Zone, value: any) => {
    setZones((prev) =>
      prev.map((zone) =>
        zone.id === id ? { ...zone, [field]: value } : zone
      )
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/popular-transfers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zones }),
      });
      if (!res.ok) throw new Error("Error saving");
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
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
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 transition">
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Viajes Populares</h1>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mostrar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de viaje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {zones.map((zone) => (
                <tr key={zone.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={zone.isPopular}
                      onChange={(e) => updateZone(zone.id, "isPopular", e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={zone.travelTimeFromAirport || ""}
                      onChange={(e) => updateZone(zone.id, "travelTimeFromAirport", e.target.value)}
                      placeholder="ej. 15 min from airport"
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-48"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={zone.sortOrder}
                      onChange={(e) => updateZone(zone.id, "sortOrder", parseInt(e.target.value) || 0)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {zones.length === 0 && (
            <div className="text-center text-gray-400 py-8">No hay zonas disponibles. Crea zonas primero.</div>
          )}
        </div>
      </div>
    </div>
  );
}