"use client";

import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";

export default function MercadoPagoProvider() {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "en-US",
    });
  }, []);

  return null;
}