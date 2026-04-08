"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export default function PayPage() {
  const params = useSearchParams();
  const amount = Number(params.get("amount"));

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
    locale: "en-US",
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">

        <h1 className="text-2xl font-bold mb-4">
          Complete your payment 💳
        </h1>

        <p className="mb-6 text-gray-600">
          Total: <strong>${amount} MXN</strong>
        </p>

        <Payment
          initialization={{
            amount,
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
                transaction_amount: amount,
              }),
            });

            const result = await res.json();

            if (result.status === "approved") {
              window.location.href = "/success";
            } else {
              window.location.href = "/error";
            }

            return result;
          }}
        />

      </div>

    </div>
  );
}