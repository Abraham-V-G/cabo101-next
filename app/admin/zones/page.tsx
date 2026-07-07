//app/admin/zones/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";

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

type FormState = {
  slug: string;
  name: string;
  latMin: string;
  latMax: string;
  lngMin: string;
  lngMax: string;
  isAirport: boolean;
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  latMin: "",
  latMax: "",
  lngMin: "",
  lngMax: "",
  isAirport: false,
};

// Convierte "San José del Cabo" -> "san-jose-del-cabo", quitando acentos y
// caracteres especiales, para autogenerar el slug mientras el admin escribe
// el nombre (sin obligarlo a inventarlo a mano).
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

// Vista previa abstracta del bounding box: no es un mapa real, es un
// rectángulo que se dibuja en vivo con los 4 límites, para que el admin
// note de inmediato si invirtió Min/Max o si algo no cuadra, sin tener
// que hacer la cuenta mentalmente.
function BoundsPreview({
  latMin,
  latMax,
  lngMin,
  lngMax,
}: {
  latMin: string;
  latMax: string;
  lngMin: string;
  lngMax: string;
}) {
  const hasAll = !!(latMin && latMax && lngMin && lngMax);
  const nums = [latMin, latMax, lngMin, lngMax].map(Number);
  const allNumeric = nums.every((n) => Number.isFinite(n));
  const isValid =
    hasAll && allNumeric && Number(latMin) < Number(latMax) && Number(lngMin) < Number(lngMax);

  const centerLat = hasAll && allNumeric ? (Number(latMin) + Number(latMax)) / 2 : null;
  const centerLng = hasAll && allNumeric ? (Number(lngMin) + Number(lngMax)) / 2 : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-400">
          N
        </span>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-400">
          S
        </span>
        <span className="absolute top-1/2 -left-4 -translate-y-1/2 text-[10px] font-medium text-gray-400">
          W
        </span>
        <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-[10px] font-medium text-gray-400">
          E
        </span>

        <div
          className={`w-full h-full rounded-lg border-2 flex items-center justify-center transition-colors ${
            !hasAll
              ? "border-dashed border-gray-200 bg-gray-50"
              : isValid
              ? "border-teal-300 bg-teal-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          {!hasAll ? (
            <span className="text-[11px] text-gray-400 text-center px-4">
              Completa los 4 límites para ver la vista previa
            </span>
          ) : !isValid ? (
            <span className="text-[11px] text-red-500 text-center px-4 font-medium">
              Min debe ser menor que Max
            </span>
          ) : (
            <div className="w-4 h-4 rounded-full bg-teal-500" />
          )}
        </div>
      </div>

      {hasAll && allNumeric && (
        <div className="text-[11px] text-gray-500 text-center leading-relaxed">
          <div>Lat: {latMin} — {latMax}</div>
          <div>Lng: {lngMin} — {lngMax}</div>
        </div>
      )}

      {isValid && centerLat !== null && centerLng !== null && (
        <a
          href={`https://www.google.com/maps/@${centerLat},${centerLng},12z`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-teal-600 hover:text-teal-700 underline underline-offset-2"
        >
          Ver en Google Maps ↗
        </a>
      )}
    </div>
  );
}

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const loadZones = async () => {
    setLoading(true);
    const res = await fetch("/api/zones");
    const data = await res.json();
    setZones(data);
    setLoading(false);
  };

  useEffect(() => {
    loadZones();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSlugTouched(false);
  };

  // Validaciones antes de enviar: evita mandar al servidor un slug
  // duplicado o límites incompletos/invertidos, y muestra el motivo
  // exacto en vez de un simple "algo salió mal".
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("El nombre es obligatorio");
    if (!form.slug.trim()) errors.push("El slug es obligatorio");
    else if (
      zones.some((z) => z.slug === form.slug.trim() && z.id !== editingId)
    ) {
      errors.push("Ya existe una zona con ese slug");
    }

    const bounds = [form.latMin, form.latMax, form.lngMin, form.lngMax];
    const anyBound = bounds.some((b) => b.trim() !== "");
    const allBounds = bounds.every((b) => b.trim() !== "");

    if (anyBound && !allBounds) {
      errors.push("Completa los 4 límites (lat/lng min/max) o déjalos todos vacíos");
    } else if (allBounds) {
      const latMin = Number(form.latMin);
      const latMax = Number(form.latMax);
      const lngMin = Number(form.lngMin);
      const lngMax = Number(form.lngMax);
      if ([latMin, latMax, lngMin, lngMax].some((n) => Number.isNaN(n))) {
        errors.push("Los límites deben ser números válidos");
      } else {
        if (latMin >= latMax) errors.push("Lat Min debe ser menor que Lat Max");
        if (lngMin >= lngMax) errors.push("Lng Min debe ser menor que Lng Max");
      }
    }

    return errors;
  }, [form, zones, editingId]);

  const handleNameChange = (value: string) => {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  };

  const handleSubmit = async () => {
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/zones/${editingId}` : "/api/zones";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      resetForm();
      await loadZones();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (zone: Zone) => {
    setEditingId(zone.id);
    setSlugTouched(true); // al editar una zona existente, no auto-regenerar su slug
    setForm({
      slug: zone.slug,
      name: zone.name,
      latMin: zone.latMin?.toString() ?? "",
      latMax: zone.latMax?.toString() ?? "",
      lngMin: zone.lngMin?.toString() ?? "",
      lngMax: zone.lngMax?.toString() ?? "",
      isAirport: zone.isAirport,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteZone = async (id: number) => {
    if (!confirm("¿Eliminar esta zona? Esto puede afectar precios y viajes populares que la usen.")) return;
    await fetch(`/api/zones/${id}`, { method: "DELETE" });
    loadZones();
  };

  const filteredZones = zones.filter((z) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return z.name.toLowerCase().includes(q) || z.slug.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <AdminHeader section="zones" />
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zonas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra las zonas geográficas usadas en precios, viajes
            populares y la búsqueda del sitio.
          </p>
        </div>

        {/* ── Formulario ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              {editingId ? "Editar zona" : "Nueva zona"}
            </h2>
          </div>

          <div className="p-6 grid md:grid-cols-[1fr_auto] gap-8">
            <div className="space-y-6">
              {/* Sección: datos básicos */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Datos básicos
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      Nombre <span className="text-red-400">*</span>
                    </label>
                    <input
                      placeholder="Ej. San José del Cabo"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      Slug <span className="text-red-400">*</span>
                    </label>
                    <input
                      placeholder="san-jose-del-cabo"
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setForm({ ...form, slug: e.target.value });
                      }}
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                    <span className="text-[11px] text-gray-400">
                      Se autogenera del nombre; puedes editarlo si lo necesitas.
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-3 cursor-pointer select-none w-fit">
                  <input
                    type="checkbox"
                    checked={form.isAirport}
                    onChange={(e) => setForm({ ...form, isAirport: e.target.checked })}
                    className="w-4 h-4 accent-teal-600"
                  />
                  <span className="text-sm text-gray-700">
                    ✈️ Esta zona es el aeropuerto
                  </span>
                </label>
              </div>

              <div className="border-t border-gray-100" />

              {/* Sección: límites geográficos */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Límites geográficos (opcional)
                </h3>
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Lat Min</label>
                    <input
                      placeholder="22.85"
                      value={form.latMin}
                      onChange={(e) => setForm({ ...form, latMin: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Lat Max</label>
                    <input
                      placeholder="23.05"
                      value={form.latMax}
                      onChange={(e) => setForm({ ...form, latMax: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Lng Min</label>
                    <input
                      placeholder="-109.95"
                      value={form.lngMin}
                      onChange={(e) => setForm({ ...form, lngMin: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">Lng Max</label>
                    <input
                      placeholder="-109.70"
                      value={form.lngMax}
                      onChange={(e) => setForm({ ...form, lngMax: e.target.value })}
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="text-xs text-red-600 space-y-0.5 list-disc list-inside">
                    {validationErrors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving || validationErrors.length > 0}
                  className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear zona"}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    disabled={saving}
                    className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {/* Vista previa del bounding box */}
            <div className="flex flex-col items-center justify-start pt-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Vista previa
              </span>
              <BoundsPreview
                latMin={form.latMin}
                latMax={form.latMax}
                lngMin={form.lngMin}
                lngMax={form.lngMax}
              />
            </div>
          </div>
        </div>

        {/* ── Lista de zonas ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-gray-900">
              Zonas existentes ({zones.length})
            </h2>
            <input
              type="text"
              placeholder="Buscar por nombre o slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <p className="text-center text-gray-400 py-12">Cargando...</p>
            ) : filteredZones.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                {zones.length === 0
                  ? "No hay zonas todavía. Crea una arriba."
                  : "Ninguna zona coincide con la búsqueda."}
              </p>
            ) : (
              filteredZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-gray-900">{zone.name}</strong>
                      <span className="text-xs font-mono text-gray-400">({zone.slug})</span>
                      {zone.isAirport && (
                        <span className="text-[11px] bg-teal-50 text-teal-700 font-medium px-2 py-0.5 rounded-full border border-teal-100">
                          ✈️ Aeropuerto
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {zone.latMin !== null && zone.latMax !== null ? (
                        <>
                          Lat: {zone.latMin} – {zone.latMax} · Lng: {zone.lngMin} – {zone.lngMax}
                        </>
                      ) : (
                        "Sin límites geográficos definidos"
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(zone)}
                      className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-100 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteZone(zone.id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}