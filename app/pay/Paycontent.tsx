"use client";

import { useSearchParams } from "next/navigation";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect } from "react";

export default function PayContent() {
  const params = useSearchParams();

  const amount = Number(params.get("amount") || 0);
  const email = params.get("email");
  const summary = params.get("summary");

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "en-US",
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">

        <h2 className="text-2xl font-semibold text-center">
          Complete Payment 💳
        </h2>

        {/* 🔥 SUMMARY */}
        <div className="bg-gray-100 p-4 rounded-xl space-y-2">
          <p className="text-sm text-gray-500">Service</p>
          <p className="font-semibold">{summary}</p>
        </div>

        {/* 💰 AMOUNT */}
        <div className="bg-black text-white p-4 rounded-xl text-center">
          <p className="text-sm">Total</p>
          <p className="text-2xl font-bold">${amount} MXN</p>
        </div>

        {/* 💳 BRICK */}
        <Payment
          initialization={{ amount }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
            },
          }}
          onSubmit={async (data) => {
            const res = await fetch("/api/process-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...data,
                transaction_amount: amount,
                email,
                summary,
              }),
            });

            return await res.json();
          }}
        />
      </div>
    </div>
  );
}