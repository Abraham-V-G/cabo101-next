import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.formData || body;

    const payment = new Payment(mp);

    const result = await payment.create({
      body: {
        transaction_amount: Number(data.transaction_amount),
        token: data.token,
        installments: data.installments,
        payment_method_id: data.payment_method_id,
        issuer_id: data.issuer_id,
        description: body.summary,

        payer: {
          email: data.payer?.email || body.email,
        },
      },
    });

    // 🔥 EMAILS SOLO SI APROBADO
    if (result.status === "approved") {

      const html = `
        <h2>Payment Confirmed ✅</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Service:</strong> ${body.summary}</p>
        <p><strong>Amount:</strong> $${body.transaction_amount} MXN</p>
        <p><strong>ID:</strong> ${result.id}</p>
      `;

      // 📩 CLIENTE
      await resend.emails.send({
        from: "Cabo101 <no-reply@cabo101.com.mx>",
        to: body.email,
        subject: "Payment Confirmation",
        html,
      });

      // 📩 ADMIN
      await resend.emails.send({
        from: "Cabo101 <no-reply@cabo101.com.mx>",
        to: "abraham_venegaz@hotmail.com",
        subject: "New Payment 💰",
        html,
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}