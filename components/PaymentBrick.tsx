//components/PaymentBrick.tsx

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
      onError={(error) => {
        console.error("BRICK ERROR:", error);
      }}
      onReady={() => {
        console.log("BRICK READY");
      }}
    />
  );
}

export default memo(PaymentBrickComponent);