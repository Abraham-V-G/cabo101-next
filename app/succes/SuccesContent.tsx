"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  // Leer todos los parámetros de la URL
  const status = params.get("status");
  const amount = params.get("amount");
  const name = params.get("name");
  const email = params.get("email");
  const vehicle = params.get("vehicle");
  const from = params.get("from");
  const to = params.get("to");
  const passengers = params.get("passengers");
  const pickupTime = params.get("pickupTime");
  const pickupDate = params.get("pickupDate");
  const phone = params.get("phone");
  const roundTrip = params.get("roundTrip") === "true";
  const returnPickupLocation = params.get("returnPickupLocation");
  const returnDropoffLocation = params.get("returnDropoffLocation");
  const returnPickupTime = params.get("returnPickupTime");
  const returnPickupDate = params.get("returnPickupDate");

  // Determinar si el pago fue exitoso o pendiente
  const isPending = status === "pending" || status === "in_process";
  const isApproved = !isPending && amount;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-5"
      >
        {/* Icono según estado */}
        <div className="text-5xl">
          {isApproved ? "✅" : isPending ? "⏳" : "❓"}
        </div>

        {/* Título según estado */}
        <h1 className={`text-2xl font-bold ${isApproved ? "text-green-600" : isPending ? "text-yellow-600" : "text-gray-600"}`}>
          {isApproved 
            ? "Booking Confirmed!" 
            : isPending 
            ? "Payment Pending" 
            : "Booking Received"}
        </h1>

        {/* Mensaje según estado */}
        <p className="text-gray-600">
          {isApproved 
            ? "A confirmation email has been sent to you." 
            : isPending 
            ? "Your payment is being processed. You will receive a confirmation email shortly."
            : "Your booking has been received. We'll contact you soon to complete the payment."}
        </p>

        {/* Detalles del viaje */}
        {name && (
          <div className="bg-gray-100 p-4 rounded-xl text-left text-sm space-y-1">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>From:</strong> {from}</p>
            <p><strong>To:</strong> {to}</p>
            <p><strong>Vehicle:</strong> {vehicle}</p>
            <p><strong>Passengers:</strong> {passengers}</p>
            <p><strong>Pickup Time:</strong> {pickupTime}</p>
            <p><strong>Pickup Date:</strong> {pickupDate}</p>
            
            {/* Viaje redondo */}
            {roundTrip && returnPickupLocation && (
              <>
                <p className="mt-2 font-semibold text-gray-700">Return Trip:</p>
                <p><strong>Return From:</strong> {returnPickupLocation}</p>
                <p><strong>Return To:</strong> {returnDropoffLocation}</p>
                <p><strong>Return Time:</strong> {returnPickupTime}</p>
                <p><strong>Return Date:</strong> {returnPickupDate}</p>
              </>
            )}
            
            <p className="mt-2 pt-2 border-t border-gray-300"><strong>Total:</strong> ${amount} MXN</p>
            {isPending && (
              <p className="text-yellow-600 text-xs mt-2">
                * You will receive a confirmation email once your payment is approved.
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}