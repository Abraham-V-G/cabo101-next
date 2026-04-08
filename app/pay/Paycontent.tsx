"use client";

import { useSearchParams } from "next/navigation";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect } from "react";

export default function PayContent() {
  const params = useSearchParams();

  const amount = Number(params.get("amount") || 0);

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "en-US", // 🔥 idioma
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-semibold mb-4">
          Complete Payment 💳
        </h2>

        <Payment
          initialization={{
            amount,
          }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
            },
          }}
          onSubmit={async (data) => {
            const res = await fetch("/api/process-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...data,
                transaction_amount: amount,
              }),
            });

            return await res.json();
          }}
        />

      </div>
    </div>
  );
}