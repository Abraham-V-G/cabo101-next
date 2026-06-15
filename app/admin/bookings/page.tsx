//app/admin/bookings/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  const loadBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();

    setBookings(data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (
    id: number,
    tripStatus: string
  ) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripStatus,
      }),
    });

    loadBookings();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Reservations
      </h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border rounded-xl p-6 bg-white"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg">
                  {booking.firstName} {booking.lastName}
                </h2>

                <p>{booking.email}</p>
                <p>{booking.phone}</p>
              </div>

              <div className="text-right">
                <p>
                  ${booking.totalUSD}
                </p>

                <p>
                  Payment: {booking.paymentStatus}
                </p>

                <p>
                  Trip: {booking.tripStatus}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p>
                {booking.pickupLocation}
              </p>

              <p>
                ↓
              </p>

              <p>
                {booking.dropoffLocation}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Date:</strong>{" "}
                {booking.pickupDate}
              </div>

              <div>
                <strong>Time:</strong>{" "}
                {booking.pickupTime}
              </div>

              <div>
                <strong>Vehicle:</strong>{" "}
                {booking.vehicleType}
              </div>

              <div>
                <strong>Passengers:</strong>{" "}
                {booking.passengers}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Airline:</strong>{" "}
                {booking.airline || "-"}
              </div>

              <div>
                <strong>Flight:</strong>{" "}
                {booking.flightNumber || "-"}
              </div>

              <div>
                <strong>Arrival:</strong>{" "}
                {booking.arrivalTime || "-"}
              </div>

              <div>
                <strong>Return Flight:</strong>{" "}
                {booking.returnFlightNumber || "-"}
              </div>
            </div>

            {booking.notes && (
              <div className="mb-4">
                <strong>Client Notes:</strong>

                <div className="border rounded p-3 mt-2">
                  {booking.notes}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() =>
                  updateStatus(
                    booking.id,
                    "pending"
                  )
                }
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Pending
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    booking.id,
                    "in_progress"
                  )
                }
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                In Progress
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    booking.id,
                    "completed"
                  )
                }
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