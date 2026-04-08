import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: Number(body.transaction_amount), // 🔥 FORZAR
        token: body.token,
        description: "Transfer Booking",
        installments: body.installments,
        payment_method_id: body.payment_method_id,
        issuer_id: body.issuer_id,

        payer: {
          email: body.payer?.email || body.email, // 🔥 fallback
        },
      },
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}