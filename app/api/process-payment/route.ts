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

    console.log("BODY:", body);

    // 🔒 VALIDACIONES
    if (!data.transaction_amount) {
      return NextResponse.json(
        { error: "transaction_amount is required" },
        { status: 400 }
      );
    }

    if (!data.token || !data.payment_method_id) {
      return NextResponse.json(
        { error: "payment data missing" },
        { status: 400 }
      );
    }

    const payment = new Payment(mp);

    const result = await payment.create({
      body: {
        transaction_amount: Number(data.transaction_amount),
        token: data.token,
        installments: data.installments,
        payment_method_id: data.payment_method_id,
        issuer_id: data.issuer_id,
        description: body.summary || "Transportation Service",

        // 🔥 CLAVE PARA EVITAR in_process
        binary_mode: true,

        payer: {
          email: body.email || data.payer?.email,
          first_name: body.name || "Client",
        },
      },
    });

    console.log("PAYMENT RESULT:", result);

    // 📩 EMAIL SOLO SI APROBADO
    if (result.status === "approved") {
      const html = `
        <div style="font-family: Arial; background:#f5f5f5; padding:20px;">
          <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden;">

            <div style="background:#000; padding:20px; text-align:center;">
              <img src="https://cabo101.com.mx/images/logo.png" style="height:50px;" />
            </div>

            <div style="padding:30px;">
              <h2>Payment Confirmed ✅</h2>

              <p><strong>Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Service:</strong> ${body.summary}</p>

              <div style="margin-top:20px; font-size:18px;">
                <strong>Total: $${body.transaction_amount} MXN</strong>
              </div>

              <p style="margin-top:20px;">
                Payment ID: ${result.id}
              </p>
            </div>

          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: "Cabo101 <no-reply@cabo101.com.mx>",
          to: body.email,
          subject: "Payment Confirmed – Cabo101",
          html,
        });

        await resend.emails.send({
          from: "Cabo101 <no-reply@cabo101.com.mx>",
          to: "cabo101guide@gmail.com",
          subject: "New Payment 💰",
          html,
        });

      } catch (err) {
        console.error("EMAIL ERROR:", err);
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}