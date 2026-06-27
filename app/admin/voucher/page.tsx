"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import VoucherDocument from "@/components/VoucherDocument";

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generar Voucher</h1>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          {/* Formulario - todos los campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Origen</label>
              <input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destino</label>
              <input name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pasajeros</label>
              <input name="passengers" value={formData.passengers} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de vehículo</label>
              <input name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de recogida</label>
              <input name="pickupDate" type="date" value={formData.pickupDate} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora de recogida</label>
              <input name="pickupTime" type="time" value={formData.pickupTime} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input name="roundTrip" type="checkbox" checked={formData.roundTrip} onChange={handleChange} />
              Viaje de regreso
            </label>
          </div>

          {formData.roundTrip && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700">Origen de regreso</label>
                <input name="returnPickupLocation" value={formData.returnPickupLocation} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destino de regreso</label>
                <input name="returnDropoffLocation" value={formData.returnDropoffLocation} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de regreso</label>
                <input name="returnPickupDate" type="date" value={formData.returnPickupDate} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de regreso</label>
                <input name="returnPickupTime" type="time" value={formData.returnPickupTime} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aerolínea</label>
              <input name="airline" value={formData.airline} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de vuelo</label>
              <input name="flight" value={formData.flight} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora de llegada</label>
              <input name="arrival" type="time" value={formData.arrival} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            {formData.roundTrip && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Vuelo de regreso</label>
                <input name="returnFlight" value={formData.returnFlight} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total (USD)</label>
              <input name="totalAmount" type="number" value={formData.totalAmount} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pagado (USD)</label>
              <input name="paidAmount" type="number" value={formData.paidAmount} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Servicio adicional (USD)</label>
              <input name="additionalService" type="number" value={formData.additionalService} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="border rounded-lg px-3 py-2 w-full" />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generando..." : "Generar Voucher PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}