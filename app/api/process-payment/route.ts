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

    // 🔒 Validaciones básicas
    if (!data.transaction_amount || !data.token || !data.payment_method_id) {
      return NextResponse.json(
        { error: "Missing payment data" },
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
        description: body.summary || "Service",

        payer: {
          email: data.payer?.email || body.email,
        },
      },
    });

    console.log("PAYMENT RESULT:", result);

    // 🔥 EMAIL SOLO SI APROBADO
    if (result.status === "approved") {

      const html = `
        <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
          
          <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; overflow:hidden;">

            <!-- HEADER -->
            <div style="background:#000; padding:20px; text-align:center;">
              <img src="https://cabo101.com.mx/images/logo.png" alt="Cabo101" style="height:50px;" />
            </div>

            <!-- BODY -->
            <div style="padding:30px;">

              <h2 style="margin-bottom:10px;">Payment Confirmed ✅</h2>
              <p style="color:#666; margin-bottom:25px;">
                Thank you for your booking. Your payment has been successfully processed.
              </p>

              <!-- SUMMARY -->
              <div style="border:1px solid #e5e5e5; border-radius:10px; padding:20px; margin-bottom:25px;">
                <p><strong>Service:</strong><br/> ${body.summary}</p>
                <p style="margin-top:10px;"><strong>Name:</strong><br/> ${body.name}</p>
                <p style="margin-top:10px;"><strong>Email:</strong><br/> ${body.email}</p>
              </div>

              <!-- TOTAL -->
              <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:bold; margin-bottom:25px;">
                <span>Total</span>
                <span style="color:#16a34a;">$${body.transaction_amount} MXN</span>
              </div>

              <!-- INFO -->
              <div style="font-size:14px; color:#555;">
                <p><strong>Payment ID:</strong> ${result.id}</p>
                <p><strong>Status:</strong> ${result.status}</p>
              </div>

            </div>

            <!-- FOOTER -->
            <div style="background:#f9f9f9; padding:20px; text-align:center; font-size:12px; color:#777;">
              <p>Cabo101 Transportation Services</p>
              <p>Los Cabos, Mexico</p>
            </div>

          </div>
        </div>
      `;

      try {
        // 📩 CLIENTE
        await resend.emails.send({
          from: "Cabo101 <no-reply@cabo101.com.mx>",
          to: body.email,
          subject: "Your payment was confirmed – Cabo101",
          html,
        });

        // 📩 ADMIN
        await resend.emails.send({
          from: "Cabo101 <no-reply@cabo101.com.mx>",
          to: "cabo101guide@gmail.com",
          subject: "New payment received 💰",
          html,
        });

      } catch (emailError) {
        console.error("EMAIL ERROR:", emailError);
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}