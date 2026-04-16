"use client";

import { memo } from "react";
import { Payment } from "@mercadopago/sdk-react";

type Props = {
  amount: number;
  onSubmit: (data: any) => Promise<any>;
};

function PaymentBrickComponent({ amount, onSubmit }: Props) {
  return (
    <Payment
      initialization={{ amount }}
      customization={{
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          ticket: "all",
        },
      }}
      onSubmit={onSubmit}
    />
  );
}

// 🔥 evita re-render SI amount no cambia
export default memo(PaymentBrickComponent);