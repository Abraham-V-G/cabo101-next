"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export default function AdminPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [showBrick, setShowBrick] = useState(false);
  const [webhooks, setWebhooks] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
    } else {
      loadWebhooks();
    }

    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "en-US", // 🔥 CAMBIAR A "es-MX" SI QUIERES ESPAÑOL
    });
  }, []);

  const loadWebhooks = async () => {
    const res = await fetch("/api/webhooks");
    const data = await res.json();
    setWebhooks(data);
  };

  const createPaymentLink = async () => {
    const res = await fetch("/api/create-payment", {
      method: "POST",
      body: JSON.stringify({
        amount,
        name,
        email,
        service,
      }),
    });

    const data = await res.json();
    setPaymentLink(data.url);
  };

  return (
    <div className="p-10 space-y-10">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* 🔥 COBRAR */}
      <div className="border p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Cobrar cliente</h2>

        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded w-full max-w-xs" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded w-full max-w-xs" />
        <input placeholder="Servicio" value={service} onChange={e => setService(e.target.value)} className="border p-2 rounded w-full max-w-xs" />
        <input placeholder="Monto" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded w-full max-w-xs" />

        <div className="flex gap-4">
          <button onClick={createPaymentLink} className="bg-black text-white px-4 py-2 rounded">
            Generar link
          </button>

          <button onClick={() => setShowBrick(true)} className="bg-green-600 text-white px-4 py-2 rounded">
            Cobrar aquí
          </button>
        </div>

        {paymentLink && (
          <div className="bg-gray-100 p-3 rounded">
            <a href={paymentLink} target="_blank" className="text-blue-600 underline">
              {paymentLink}
            </a>
          </div>
        )}
      </div>

      {/* 💳 BRICK */}
      {showBrick && (
        <div className="border p-6 rounded-xl">
          <Payment
            initialization={{
                amount: Number(amount),
            }}
            customization={{
                paymentMethods: {
                creditCard: "all",
                debitCard: "all",
                ticket: "all",
                },
            }}
            onSubmit={async (paymentData) => {
                const res = await fetch("/api/process-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...paymentData,
                    transaction_amount: Number(amount),
                }),
                });

                const result = await res.json();

                if (result.status === "approved") {
                alert("✅ Pago aprobado");
                } else {
                alert("❌ Pago rechazado");
                }

                return result;
            }}
            />
        </div>
      )}

      {/* 🔥 WEBHOOKS */}
      <div className="border p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Webhooks</h2>

        {webhooks.map((w, i) => (
          <pre key={i} className="bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(w, null, 2)}
          </pre>
        ))}
      </div>

      {/* 🚧 RESERVAS (NO FUNCIONAL) */}
      <div className="border p-6 rounded-xl opacity-60">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <p>Próximamente podrás ver todas las reservas aquí</p>
      </div>

      {/* 🚧 PAGOS (NO FUNCIONAL) */}
      <div className="border p-6 rounded-xl opacity-60">
        <h2 className="text-xl font-semibold">Pagos</h2>
        <p>Historial de pagos próximamente</p>
      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/admin/login");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}