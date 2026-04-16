// app/admin/page.tsx
"use client";

import { useState, useCallback } from "react";
import PaymentBrick from "@/components/PaymentBrick";

export default function AdminDashboard() {
  // ========== FORM STATE ==========
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [passengers, setPassengers] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [returnPickupLocation, setReturnPickupLocation] = useState("");
  const [returnDropoffLocation, setReturnDropoffLocation] = useState("");
  const [returnPickupTime, setReturnPickupTime] = useState("");
  const [returnPickupDate, setReturnPickupDate] = useState("");
  const [additionalService, setAdditionalService] = useState("0");

  const [loading, setLoading] = useState(false);
  const [showBrick, setShowBrick] = useState(false);

  // 🔗 1. Generar link de pago (Checkout Pro)
  const handleGenerateLink = async () => {
    if (!amount) return alert("❌ El monto es obligatorio");
    try {
      setLoading(true);
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          email,
          summary,
          name,
          phone,
          pickupLocation,
          dropoffLocation,
          passengers,
          vehicleType,
          pickupTime,
          pickupDate,
          roundTrip,
          returnPickupLocation,
          returnDropoffLocation,
          returnPickupTime,
          returnPickupDate,
          additionalService: Number(additionalService),
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.url) window.open(data.url, "_blank");
      else alert("Error generando link");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // 🚪 2. Abrir página pública de pago (con todos los datos en URL)
  const handleOpenPaymentPage = () => {
    if (!amount) return alert("❌ El monto es obligatorio");
    const params = new URLSearchParams({
      amount: amount,
      email: email || "",
      summary: summary || "Transportation Service",
      name: name || "",
      phone: phone || "",
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      passengers: passengers || "",
      vehicleType: vehicleType || "",
      pickupTime: pickupTime || "",
      pickupDate: pickupDate || "",
      roundTrip: roundTrip ? "true" : "false",
      returnPickupLocation: returnPickupLocation || "",
      returnDropoffLocation: returnDropoffLocation || "",
      returnPickupTime: returnPickupTime || "",
      returnPickupDate: returnPickupDate || "",
      additionalService: additionalService || "0",
    });
    window.location.href = `/pay?${params.toString()}`;
  };

  // 💳 3. Mostrar Brick para pago dentro del admin
  const handleShowBrick = () => {
    if (!amount) return alert("❌ El monto es obligatorio");
    setShowBrick(true);
  };

  const handleAdminPayment = useCallback(
    async (data: any) => {
      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          transaction_amount: Number(amount),
          name: name || "Admin Payment",
          email: email || "admin@cabo101.com",
          summary: summary || "Transportation Service",
          phone,
          pickupLocation,
          dropoffLocation,
          passengers,
          vehicleType,
          pickupTime,
          pickupDate,
          roundTrip,
          returnPickupLocation,
          returnDropoffLocation,
          returnPickupTime,
          returnPickupDate,
          additionalService: Number(additionalService),
          paidAmount: Number(amount),
        }),
      });
      const result = await res.json();
      console.log("ADMIN PAYMENT RESULT:", result);
      if (result.status === "approved") alert("✅ Pago aprobado");
      else if (result.status === "pending" || result.status === "in_process")
        alert("⏳ Pago pendiente");
      else alert("❌ Pago fallido");
      return result;
    },
    [
      amount,
      name,
      email,
      summary,
      phone,
      pickupLocation,
      dropoffLocation,
      passengers,
      vehicleType,
      pickupTime,
      pickupDate,
      roundTrip,
      returnPickupLocation,
      returnDropoffLocation,
      returnPickupTime,
      returnPickupDate,
      additionalService,
    ]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard </h1>

        {/* Formulario de creación de pago / reserva */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">
          <h2 className="text-xl font-semibold">Crear Pago / Reserva</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del cliente (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="email"
              placeholder="Email del cliente (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="text"
              placeholder="Teléfono (opcional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="text"
              placeholder="Descripción del servicio (opcional)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="number"
              placeholder="Monto (MXN) *"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded-xl px-4 py-3 border-red-300 focus:border-red-500"
              required
            />
            <input
              type="text"
              placeholder="Lugar de recogida (opcional)"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="text"
              placeholder="Destino (opcional)"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="text"
              placeholder="Número de pasajeros (opcional)"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="text"
              placeholder="Tipo de vehículo (opcional)"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="time"
              placeholder="Hora de recogida (opcional)"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <input
              type="date"
              placeholder="Fecha de recogida (opcional)"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
              />
              <label>Viaje redondo (opcional)</label>
            </div>
            {roundTrip && (
              <>
                <input
                  type="text"
                  placeholder="Lugar de regreso (opcional)"
                  value={returnPickupLocation}
                  onChange={(e) => setReturnPickupLocation(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Destino de regreso (opcional)"
                  value={returnDropoffLocation}
                  onChange={(e) => setReturnDropoffLocation(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="time"
                  placeholder="Hora de regreso (opcional)"
                  value={returnPickupTime}
                  onChange={(e) => setReturnPickupTime(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="date"
                  placeholder="Fecha de regreso (opcional)"
                  value={returnPickupDate}
                  onChange={(e) => setReturnPickupDate(e.target.value)}
                  className="border rounded-xl px-4 py-3"
                />
              </>
            )}
            <input
              type="number"
              placeholder="Servicio adicional (MXN, opcional)"
              value={additionalService}
              onChange={(e) => setAdditionalService(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGenerateLink}
              className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              {loading ? "Generando..." : "Generate Link"}
            </button>
            <button
              onClick={handleOpenPaymentPage}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Open Payment Page
            </button>
            <button
              onClick={handleShowBrick}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Pay Here (Admin)
            </button>
          </div>
        </div>

        {/* SECCIONES ADICIONALES (sin funcionalidad real) */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Ver pagos */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
               Ver pagos
            </h3>
            <p className="text-gray-500 text-sm">
              Aquí se mostrará un listado de todos los pagos realizados.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">

              <div className="text-gray-400 italic">Próximamente más detalles...</div>
            </div>
          </div>

          {/* Ver reservas */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
               Ver reservas
            </h3>
            <p className="text-gray-500 text-sm">
              Listado de reservas de transporte registradas.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">

              <div className="text-gray-400 italic">Próximamente más detalles...</div>
            </div>
          </div>

          {/* Viajes */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              Viajes
            </h3>
            <p className="text-gray-500 text-sm">
              Próximos viajes y rutas programadas.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="text-gray-400 italic">Más información próximamente...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}