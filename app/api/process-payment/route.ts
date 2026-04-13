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
      <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
        
        <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <div style="background:#0f766e; padding:20px; text-align:center;">
            <img src="https://cabo101.com.mx/images/logo.png" width="60" />
            <h2 style="color:white; margin:10px 0 0;">Payment Confirmation</h2>
          </div>

          <!-- BODY -->
          <div style="padding:25px;">

            <p style="font-size:16px;">Hi <strong>${body.name}</strong>,</p>
            <p style="color:#555;">
              Your booking has been successfully processed. Here are your payment details:
            </p>

            <!-- SUMMARY CARD -->
            <div style="border:1px solid #e5e7eb; border-radius:10px; padding:15px; margin:20px 0;">

              <h3 style="margin-bottom:10px;">Service Summary</h3>

              <p><strong>Service:</strong> ${body.summary}</p>
              <p><strong>Amount Paid:</strong> $${body.transaction_amount} MXN</p>
              <p><strong>Status:</strong> ${result.status}</p>
              <p><strong>Payment ID:</strong> ${result.id}</p>

            </div>

            <!-- CLIENT INFO -->
            <div style="margin-bottom:20px;">
              <h3>Client Information</h3>
              <p><strong>Name:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
            </div>

            <!-- IMPORTANT NOTE -->
            <div style="background:#ecfdf5; border-left:4px solid #16a34a; padding:12px; border-radius:6px;">
              <p style="margin:0; font-size:14px;">
                Please keep this email as your receipt. Our team will contact you if needed.
              </p>
            </div>

          </div>

          <!-- FOOTER -->
          <div style="background:#111827; color:white; text-align:center; padding:20px;">
            <p style="margin:0;">Cabo101 Transportation</p>
            <p style="margin:5px 0; font-size:12px; opacity:0.7;">
              Los Cabos, Mexico
            </p>
          </div>

        </div>

      </div>
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
        to: "cabo101guide@gmail.com",
        subject: "New Payment",
        html,
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}