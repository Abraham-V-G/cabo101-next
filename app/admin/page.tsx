"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔗 GENERAR LINK DE PAGO
  const handleGenerateLink = async () => {
    if (!amount) return alert("Enter amount");

    try {
      setLoading(true);

      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          email,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Error generating link");
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // 💳 IR A PÁGINA DE PAGO (BRICK)
  const handleGoToBrick = () => {
    if (!amount) return alert("Enter amount");

    window.location.href = `/pay?amount=${amount}&email=${email}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard ⚙️
        </h1>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          <Card title="Reservations" desc="Manage bookings" />
          <Card title="Payments" desc="View payments" />
          <Card title="Webhooks" desc="Monitor events" />

        </div>

        {/* PAYMENT GENERATOR */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">

          <h2 className="text-xl font-semibold">
            Generate Payment 💳
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="number"
              placeholder="Amount (MXN)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="email"
              placeholder="Customer Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-xl px-4 py-3 outline-none"
            />

          </div>

          <div className="flex gap-4">

            <button
              onClick={handleGenerateLink}
              className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              {loading ? "Generating..." : "Generate Link"}
            </button>

            <button
              onClick={handleGoToBrick}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Open Payment Page
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

// 🔥 CARD COMPONENT
function Card({ title, desc }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{desc}</p>
    </div>
  );
}