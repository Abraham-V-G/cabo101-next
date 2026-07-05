//app/admin/prices/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

interface Vehicle {
  id: number;
  name: string;
}
interface Zone {
  id: number;
  slug: string;
  name: string;
  isAirport?: boolean;
}
interface Price {
  id: number;
  fromZone: string;
  toZone: string;
  vehicleId: number;
  oneWay: number;
  roundTrip: number;
  vehicle?: Vehicle;
}

type EditingCell = {
  fromZone: string;
  toZone: string;
  fromName: string;
  toName: string;
  existing: Price | null;
};

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [cellForm, setCellForm] = useState({ oneWay: "", roundTrip: "" });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [pricesRes, vehiclesRes, zonesRes] = await Promise.all([
      fetch("/api/prices"),
      fetch("/api/vehicles"),
      fetch("/api/zones"),
    ]);
    const [pricesData, vehiclesData, zonesData]: [Price[], Vehicle[], Zone[]] =
      await Promise.all([pricesRes.json(), vehiclesRes.json(), zonesRes.json()]);

    setPrices(pricesData);
    setVehicles(vehiclesData);
    setZones(zonesData);
    setLoading(false);

    setSelectedVehicleId((current) => {
      if (current && vehiclesData.some((v) => v.id === current)) return current;
      return vehiclesData[0]?.id ?? null;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Búsqueda O(1) de precio por combinación fromZone+toZone+vehicleId,
  // en vez de recorrer el arreglo completo en cada celda de la matriz.
  const priceMap = useMemo(() => {
    const map = new Map<string, Price>();
    prices.forEach((p) => {
      map.set(`${p.fromZone}|${p.toZone}|${p.vehicleId}`, p);
    });
    return map;
  }, [prices]);

  // Zonas que no tienen NINGÚN precio configurado (en ninguna dirección,
  // con ningún vehículo) — para que el admin las note de inmediato en vez
  // de tener que descubrirlo revisando fila por fila.
  const zonesWithoutAnyPrice = useMemo(() => {
    return zones.filter(
      (z) => !prices.some((p) => p.fromZone === z.slug || p.toZone === z.slug)
    );
  }, [zones, prices]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

  const openEditor = (fromZone: Zone, toZone: Zone) => {
    if (!selectedVehicleId) {
      alert("Selecciona un vehículo primero");
      return;
    }
    const existing =
      priceMap.get(`${fromZone.slug}|${toZone.slug}|${selectedVehicleId}`) || null;

    setEditingCell({
      fromZone: fromZone.slug,
      toZone: toZone.slug,
      fromName: fromZone.name,
      toName: toZone.name,
      existing,
    });
    setCellForm({
      oneWay: existing ? String(existing.oneWay) : "",
      roundTrip: existing ? String(existing.roundTrip) : "",
    });
  };

  const closeEditor = () => {
    setEditingCell(null);
    setCellForm({ oneWay: "", roundTrip: "" });
  };

  const handleSaveCell = async () => {
    if (!editingCell || !selectedVehicleId) return;
    if (!cellForm.oneWay || !cellForm.roundTrip) {
      alert("Completa ambos precios (One way y Round trip)");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fromZone: editingCell.fromZone,
        toZone: editingCell.toZone,
        vehicleId: selectedVehicleId,
        oneWay: Number(cellForm.oneWay),
        roundTrip: Number(cellForm.roundTrip),
      };

      if (editingCell.existing) {
        await fetch(`/api/prices/${editingCell.existing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await loadData();
      closeEditor();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCell = async () => {
    if (!editingCell?.existing) return;
    if (!confirm("¿Eliminar este precio?")) return;
    setSaving(true);
    try {
      await fetch(`/api/prices/${editingCell.existing.id}`, { method: "DELETE" });
      await loadData();
      closeEditor();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Precios</h1>
            <p className="text-sm text-gray-500 mt-1">
              Matriz de zona origen × zona destino. Selecciona un vehículo y
              haz clic en cualquier celda para crear o editar su precio.
            </p>
          </div>
          <button
            onClick={loadData}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Selector de vehículo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Vehículo
          </p>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  selectedVehicleId === v.id
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-teal-300"
                }`}
              >
                {v.name}
              </button>
            ))}
            {vehicles.length === 0 && !loading && (
              <p className="text-sm text-gray-400">
                No hay vehículos registrados todavía.
              </p>
            )}
          </div>
        </div>

        {/* Aviso de zonas sin ningún precio configurado */}
        {zonesWithoutAnyPrice.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">
              ⚠ Zonas sin ningún precio configurado ({zonesWithoutAnyPrice.length})
            </p>
            <p className="text-sm text-amber-700">
              {zonesWithoutAnyPrice.map((z) => z.name).join(", ")}
            </p>
          </div>
        )}

        {/* Matriz */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-50 border border-teal-200 inline-block" />
              Precio configurado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200 inline-block" />
              Falta precio — clic para agregar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200 inline-block" />
              Misma zona (N/A)
            </span>
            {selectedVehicle && (
              <span className="ml-auto font-medium text-gray-700">
                Mostrando: {selectedVehicle.name}
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-16">Cargando...</p>
          ) : zones.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No hay zonas registradas todavía.
            </p>
          ) : (
            <div className="overflow-auto max-h-[70vh]">
              <table className="border-collapse text-sm w-full">
                <thead>
                  <tr>
                    <th className="sticky top-0 left-0 z-20 bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Desde \ Hacia
                    </th>
                    {zones.map((toZone) => (
                      <th
                        key={toZone.id}
                        className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap"
                      >
                        {toZone.name}
                        {toZone.isAirport && (
                          <span className="ml-1 text-[10px] text-teal-600">✈</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {zones.map((fromZone) => (
                    <tr key={fromZone.id}>
                      <th className="sticky left-0 z-10 bg-gray-50 border-r border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {fromZone.name}
                        {fromZone.isAirport && (
                          <span className="ml-1 text-[10px] text-teal-600">✈</span>
                        )}
                      </th>
                      {zones.map((toZone) => {
                        const sameZone = fromZone.slug === toZone.slug;
                        if (sameZone) {
                          return (
                            <td
                              key={toZone.id}
                              className="border-b border-gray-100 bg-gray-100 px-3 py-2 text-center text-gray-300"
                            >
                              —
                            </td>
                          );
                        }

                        const price = selectedVehicleId
                          ? priceMap.get(
                              `${fromZone.slug}|${toZone.slug}|${selectedVehicleId}`
                            )
                          : undefined;

                        return (
                          <td
                            key={toZone.id}
                            onClick={() => openEditor(fromZone, toZone)}
                            className={`border-b border-gray-100 px-3 py-2 text-center cursor-pointer transition whitespace-nowrap ${
                              price
                                ? "bg-teal-50/60 hover:bg-teal-100"
                                : "bg-amber-50/60 hover:bg-amber-100"
                            }`}
                          >
                            {price ? (
                              <div className="leading-tight">
                                <div className="font-medium text-gray-800">
                                  ${price.oneWay}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  RT ${price.roundTrip}
                                </div>
                              </div>
                            ) : (
                              <span className="text-amber-600 text-xs font-medium">
                                + Agregar
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición de celda */}
      {editingCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {editingCell.fromName} → {editingCell.toName}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Vehículo: {selectedVehicle?.name}
            </p>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  One way (USD)
                </label>
                <input
                  type="number"
                  value={cellForm.oneWay}
                  onChange={(e) =>
                    setCellForm((f) => ({ ...f, oneWay: e.target.value }))
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Round trip (USD)
                </label>
                <input
                  type="number"
                  value={cellForm.roundTrip}
                  onChange={(e) =>
                    setCellForm((f) => ({ ...f, roundTrip: e.target.value }))
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveCell}
                disabled={saving}
                className="flex-1 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
              {editingCell.existing && (
                <button
                  onClick={handleDeleteCell}
                  disabled={saving}
                  className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
              <button
                onClick={closeEditor}
                disabled={saving}
                className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}