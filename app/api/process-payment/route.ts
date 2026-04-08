import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: body.transaction_amount,
        token: body.token,
        description: "Cabo101 Transfer",
        installments: body.installments,
        payment_method_id: body.payment_method_id,
        issuer_id: body.issuer_id,
        payer: {
          email: body.payer?.email || body.email,
        },
      },
    });

    // ✅ SI EL PAGO FUE APROBADO
    if (result.status === "approved") {
      const bookingData = {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        phone: body.phone,
        from: body.from,
        to: body.to,
        vehicle: body.vehicle.name,
        price: body.vehicle.price,
      };

      // 📧 EMAIL AL CLIENTE
      await resend.emails.send({
        from: "Cabo101 <onboarding@resend.dev>",
        to: bookingData.email,
        subject: "✅ Your booking is confirmed!",
        html: `
          <h2>🚗 Booking Confirmed</h2>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>From:</strong> ${bookingData.from}</p>
          <p><strong>To:</strong> ${bookingData.to}</p>
          <p><strong>Vehicle:</strong> ${bookingData.vehicle}</p>
          <p><strong>Total:</strong> $${bookingData.price} MXN</p>
          <br/>
          <p>Thank you for choosing Cabo101 🙌</p>
        `,
      });

      // 📧 EMAIL AL ADMIN
      await resend.emails.send({
        from: "Cabo101 <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL!,
        subject: "🚨 New Booking Received",
        html: `
          <h2>New Booking 🚗</h2>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Phone:</strong> ${bookingData.phone}</p>
          <p><strong>From:</strong> ${bookingData.from}</p>
          <p><strong>To:</strong> ${bookingData.to}</p>
          <p><strong>Vehicle:</strong> ${bookingData.vehicle}</p>
          <p><strong>Total:</strong> $${bookingData.price} MXN</p>
        `,
      });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("MP ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}