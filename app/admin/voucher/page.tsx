//app/admin/voucher/page.tsx
"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import VoucherDocument from "@/components/VoucherDocument";
import AdminHeader from "@/components/AdminHeader";

export default function VoucherPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    dropoffLocation: "",
    passengers: "",
    vehicleType: "",
    pickupDate: "",
    pickupTime: "",
    roundTrip: false,
    returnPickupLocation: "",
    returnDropoffLocation: "",
    returnPickupDate: "",
    returnPickupTime: "",
    airline: "",
    flight: "",
    arrival: "",
    returnFlight: "",
    totalAmount: 0,
    paidAmount: 0,
    additionalService: 0,
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const doc = (
        <VoucherDocument
          data={{
            ...formData,
            totalAmount: Number(formData.totalAmount) || 0,
            paidAmount: Number(formData.paidAmount) || 0,
            additionalService: Number(formData.additionalService) || 0,
            voucherNumber: `V-${Date.now().toString().slice(-6)}`,
          }}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `voucher-${formData.firstName || 'cliente'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el voucher");
    } finally {
      setLoading(false);
    }
  };

  // Estilo de input compartido en todo el formulario, consistente con el
  // resto del panel de admin.
  const inputClass =
    "border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition";
  const labelClass = "text-xs font-medium text-gray-500";

  const SectionBadge = ({ n }: { n: number }) => (
    <div className="w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-[10px] font-bold">{n}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader section="Generar Voucher" />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generar Voucher</h1>
          <p className="text-sm text-gray-500 mt-1">
            Crea un voucher PDF manual para cobros en efectivo o externos.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-8">
            {/* ── Sección 1: Cliente ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionBadge n={1} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cliente</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Nombre</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Apellido</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Teléfono</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Sección 2: Servicio ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionBadge n={2} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Servicio</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Origen</label>
                  <input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Destino</label>
                  <input name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Pasajeros</label>
                  <input name="passengers" value={formData.passengers} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Tipo de vehículo</label>
                  <input name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={inputClass} />
                </div>
                <div />
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Fecha de recogida</label>
                  <input name="pickupDate" type="date" value={formData.pickupDate} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Hora de recogida</label>
                  <input name="pickupTime" type="time" value={formData.pickupTime} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Sección 3: Vuelo ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionBadge n={3} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Vuelo</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Aerolínea</label>
                  <input name="airline" value={formData.airline} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Número de vuelo</label>
                  <input name="flight" value={formData.flight} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Hora de llegada</label>
                  <input name="arrival" type="time" value={formData.arrival} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Sección 4: Viaje de regreso ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionBadge n={4} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Viaje de regreso</h3>
                <label className="ml-auto flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="roundTrip"
                      checked={formData.roundTrip}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-checked:bg-teal-600 rounded-full transition-colors duration-200" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {formData.roundTrip ? "Activado" : "Desactivado"}
                  </span>
                </label>
              </div>

              {formData.roundTrip && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Origen de regreso</label>
                      <input name="returnPickupLocation" value={formData.returnPickupLocation} onChange={handleChange} className={`${inputClass} bg-white`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Destino de regreso</label>
                      <input name="returnDropoffLocation" value={formData.returnDropoffLocation} onChange={handleChange} className={`${inputClass} bg-white`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Vuelo de regreso</label>
                      <input name="returnFlight" value={formData.returnFlight} onChange={handleChange} className={`${inputClass} bg-white`} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Fecha de regreso</label>
                      <input name="returnPickupDate" type="date" value={formData.returnPickupDate} onChange={handleChange} className={`${inputClass} bg-white`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Hora de regreso</label>
                      <input name="returnPickupTime" type="time" value={formData.returnPickupTime} onChange={handleChange} className={`${inputClass} bg-white`} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Sección 5: Pago ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionBadge n={5} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pago</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Total (USD)</label>
                  <input name="totalAmount" type="number" value={formData.totalAmount} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Pagado (USD)</label>
                  <input name="paidAmount" type="number" value={formData.paidAmount} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Servicio adicional (USD)</label>
                  <input name="additionalService" type="number" value={formData.additionalService} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Sección 6: Notas ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SectionBadge n={6} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Notas</h3>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Notas adicionales para el voucher..."
              />
            </div>
          </div>

          {/* Footer con acción */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {loading ? "Generando..." : "Generar Voucher PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}