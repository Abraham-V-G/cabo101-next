//app/admin/bookings/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      console.log("Fetching bookings...");
      const res = await fetch("/api/bookings", {
        credentials: "include", // importante si tu API requiere la cookie de sesión
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("Bookings received:", data);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading bookings:", err);
      setError(err.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (id: number, tripStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripStatus }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      // Recargar la lista después de actualizar
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el estado");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando reservas...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}. Verifica la consola.
      </div>
    );
  }

  if (bookings.length === 0) {
    return <div className="p-8 text-center text-gray-500">No hay reservas aún.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Reservations</h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-xl p-6 bg-white">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg">
                  {booking.firstName} {booking.lastName}
                </h2>
                <p>{booking.email}</p>
                <p>{booking.phone}</p>
              </div>

              <div className="text-right">
                <p>${booking.totalUSD}</p>
                <p>Payment: {booking.paymentStatus}</p>
                <p>Trip: {booking.tripStatus}</p>
              </div>
            </div>

            <div className="mb-4">
              <p>{booking.pickupLocation}</p>
              <p>↓</p>
              <p>{booking.dropoffLocation}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Date:</strong> {booking.pickupDate}
              </div>
              <div>
                <strong>Time:</strong> {booking.pickupTime}
              </div>
              <div>
                <strong>Vehicle:</strong> {booking.vehicleType}
              </div>
              <div>
                <strong>Passengers:</strong> {booking.passengers}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Airline:</strong> {booking.airline || "-"}
              </div>
              <div>
                <strong>Flight:</strong> {booking.flightNumber || "-"}
              </div>
              <div>
                <strong>Arrival:</strong> {booking.arrivalTime || "-"}
              </div>
              <div>
                <strong>Return Flight:</strong> {booking.returnFlightNumber || "-"}
              </div>
            </div>

            {booking.notes && (
              <div className="mb-4">
                <strong>Client Notes:</strong>
                <div className="border rounded p-3 mt-2">{booking.notes}</div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(booking.id, "pending")}
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Pending
              </button>
              <button
                onClick={() => updateStatus(booking.id, "in_progress")}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                In Progress
              </button>
              <button
                onClick={() => updateStatus(booking.id, "completed")}
                className="bg-green-600 text-white px-3 py-2 rounded"
              >
                Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}