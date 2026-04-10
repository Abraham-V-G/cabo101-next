"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PayContent() {
  const params = useSearchParams();
  const router = useRouter();

  const amount = Number(params.get("amount") || 0);
  const summary = params.get("summary") || "Transportation Service";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "en-US",
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6">

        {/* LOGO */}
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="logo" width={70} height={70} />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center">
          Complete Payment
        </h2>

        {/* SUMMARY */}
        <div className="border-2 border-green-400 rounded-xl p-4 text-center">
          <p className="font-medium">{summary}</p>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

        </div>

        {/* PAYMENT */}
        <div className="pt-2 border-t space-y-4">

          <Payment
            initialization={{ amount }}
            customization={{
              paymentMethods: {
                creditCard: "all",
                debitCard: "all",
              },
            }}
            onSubmit={async (data) => {

              // 🔥 VALIDACIÓN
              if (!name || !email) {
                alert("Please complete name and email");
                return;
              }

              const res = await fetch("/api/process-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...data,
                  transaction_amount: amount,
                  email,
                  name,
                  summary,
                }),
              });

              const result = await res.json();

              // 🔥 REDIRECCIÓN
              if (result.status === "approved") {
                router.push(`/succes?amount=${amount}&name=${name}`);
              } else if (
                result.status === "pending" ||
                result.status === "in_process"
              ) {
                router.push(`/error?type=pending`);
              } else {
                router.push(`/error?type=failed`);
              }

              return result;
            }}
          />

          {/* TOTAL */}
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span className="text-green-600">${amount} MXN</span>
          </div>

        </div>

      </div>
    </div>
  );
}