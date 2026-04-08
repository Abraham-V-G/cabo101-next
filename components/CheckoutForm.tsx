"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ vehicle, from, to }: any) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    airline: "",
    flightNumber: "",
    arrivalTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "error">(null);

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "es-MX",
    });
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
    >
      <h2 className="text-3xl font-semibold">Complete your booking</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input name="firstName" label="First Name" onChange={handleChange} />
        <Input name="lastName" label="Last Name" onChange={handleChange} />
        <Input name="email" label="Email" onChange={handleChange} />
        <Input name="phone" label="Phone" onChange={handleChange} />
        <Input name="airline" label="Airline" onChange={handleChange} />
        <Input name="flightNumber" label="Flight Number" onChange={handleChange} />

        {/* Arrival Time mejorado con etiqueta flotante */}
        <div className="col-span-2 relative">
          <input
            type="time"
            name="arrivalTime"
            id="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:ring-2 focus:ring-black transition bg-white"
          />
          <label
            htmlFor="arrivalTime"
            className="absolute left-4 top-2 text-xs text-gray-500 transition-all
            peer-placeholder-shown:top-3.5
            peer-placeholder-shown:text-sm
            peer-focus:top-2
            peer-focus:text-xs"
          >
            Arrival Time
          </label>
        </div>
      </div>

      {/* Payment section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Payment 💳</h3>
        <Payment
          initialization={{
            amount: Number(vehicle.price),
          }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
            },
          }}
          onSubmit={async (paymentData) => {
            try {
              setLoading(true);
              setStatus(null);

              const res = await fetch("/api/process-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...paymentData,
                  transaction_amount: Number(vehicle.price),
                  ...formData,
                  vehicle,
                  from,
                  to,
                }),
              });

              const result = await res.json();
              setLoading(false);

              if (result.status === "approved") {
                router.push(
                  `/success?name=${formData.firstName}&email=${formData.email}&vehicle=${vehicle.name}&from=${from}&to=${to}&price=${vehicle.price}`
                );
              } else {
                router.push("/error");
              }

              return result;
            } catch (error) {
              console.error(error);
              setLoading(false);
              router.push("/error");
            }
          }}
          onError={(error) => {
            console.error("Brick error:", error);
            setStatus("error");
          }}
        />
      </div>

      {loading && <p className="text-blue-500">Processing payment...</p>}
      {status === "error" && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          ❌ Payment failed. Please try again.
        </div>
      )}
    </motion.div>
  );
}

// Componente Input genérico (sin cambios)
function Input({
  name,
  label,
  type = "text",
  onChange,
  full = false,
}: any) {
  return (
    <div className={`${full ? "col-span-2" : ""} relative`}>
      <input
        name={name}
        type={type}
        required
        onChange={onChange}
        placeholder=" "
        className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:ring-2 focus:ring-black transition"
      />
      <label
        className="absolute left-4 top-2 text-xs text-gray-500 transition-all
        peer-placeholder-shown:top-3.5
        peer-placeholder-shown:text-sm
        peer-focus:top-2
        peer-focus:text-xs"
      >
        {label}
      </label>
    </div>
  );
}
