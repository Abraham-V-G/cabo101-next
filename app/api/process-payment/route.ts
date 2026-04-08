import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const data = body.formData || body; // 🔥 CLAVE

    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: Number(data.transaction_amount),
        token: data.token,
        description: "Transfer Booking",
        installments: data.installments,
        payment_method_id: data.payment_method_id,
        issuer_id: data.issuer_id,

        payer: {
          email: data.payer?.email || body.email,
        },
      },
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}