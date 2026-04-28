// app/api/process-payment/route.ts
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
        installments: Number(data.installments),
        payment_method_id: data.payment_method_id,
        issuer_id: data.issuer_id,
        description: body.summary,

        payer: {
          email: body.email,
          first_name: body.name,
        },

        metadata: {
          ...body, // guardamos todo lo que llegue
        },

        binary_mode: true,
      },
    });

    // Solo enviar correo si el pago fue aprobado
    if (result.status === "approved") {
      const folio = `#${result.id?.toString().slice(-6) || "000000"}`;
      const tripType = body.roundTrip === true ? "Round Trip" : "One Way";

      // Valores por defecto si no vienen
      const pickupLocation = body.pickupLocation || "No especificado";
      const dropoffLocation = body.dropoffLocation || "No especificado";
      const passengers = body.passengers || "1";
      const vehicleType = body.vehicleType || "Estándar";
      const pickupTime = body.pickupTime || "No especificada";
      const pickupDate = body.pickupDate || "No especificada";
      const phone = body.phone || "No proporcionado";
      const roundTrip = body.roundTrip === true;

      const returnPickupLocation = body.returnPickupLocation || "";
      const returnDropoffLocation = body.returnDropoffLocation || "";
      const returnPickupTime = body.returnPickupTime || "";
      const returnPickupDate = body.returnPickupDate || "";

      const subtotal = Number(body.transaction_amount) || 0;
      const additionalService = Number(body.additionalService) || 0;
      const total = subtotal + additionalService;
      const paidAmount = Number(body.paidAmount) || subtotal; // si no se envía, asumimos que pagó todo
      const toPay = total - paidAmount;

      // HTML profesional completo (el que me diste, pero con variables dinámicas)
     const html = `
<div style="font-family: 'Trebuchet MS', Tahoma, sans-serif; background:#f3f4f6; padding:20px;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; margin:auto; background:white; border-radius:12px; overflow:hidden;">

    <!-- HEADER -->
    <tr>
      <td style="background:#d4f5e7; padding:25px;">
        <table width="100%">
          <tr>
            <td>
              <h2 style="margin:0; color:#1f2937; font-size:25px;">
                Your Transfer <br/> Is Confirmed   <img src="https://cabo101.com.mx/images/palomita.png" width="20"   style="vertical-align:middle; margin-left:6px;"/>
              </h2>
              <p style="margin-top:10px; color:#374151; font-size:12px;">
                Thank you for choosing CABO 101. <br/>
                Our driver will be ready for you.
              </p>
            </td>
            <td align="right">
              <img src="https://cabo101.com.mx/images/logo-color.png" width="80"/>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- INFO -->
    <tr>
      <td style="padding:20px;">
        <table width="100%" style="font-size:14px;">
          <tr>
            <td><strong>Booking Date</strong><br/>${body.pickupDate || "-"}</td>
            <td><strong>Folio</strong><br/>${result.id}</td>
            <td><strong>Service Type</strong><br/>${body.roundTrip ? "Round Trip" : "One way"}</td>
          </tr>

          <tr><td height="15"></td></tr>

          <tr>
            <td><strong>Name</strong><br/>${body.name}</td>
            <td><strong>Phone</strong><br/>${body.phone || "-"}</td>
            <td><strong>Email</strong><br/>${body.email}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SERVICE -->
    <tr>
      <td style="padding:20px;">
        <h3 style="margin-bottom:10px; font-size:18px;">Transportation Service</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
        <tr>
          <td style="border-top:2px solid #e5e7eb;"></td>
        </tr>
        </table>
        <!-- OUTBOUND -->
        <table width="100%" style="font-size:13px;">
          <tr>
            <td colspan="3"><strong style="text-decoration:underline; text-underline-offset:5px;">OUTBOUND</strong></td>
          </tr>

          <tr><td height="10"></td></tr>

          <tr>
            <td><strong>From</strong><br/>${body.pickupLocation}</td>
            <td><strong>To</strong><br/>${body.dropoffLocation}</td>
            <td><strong>Passengers</strong><br/>${body.passengers}</td>
          </tr>

          <tr>
            <td><strong>Vehicle</strong><br/>${body.vehicleType}</td>
            <td><strong>Pick-up Time</strong><br/>${body.pickupTime}</td>
            <td><strong>Date</strong><br/>${body.pickupDate}</td>
          </tr>
        </table>

        ${body.roundTrip ? `
        <br/>

        <!-- RETURN -->
        <table width="100%" style="font-size:13px;">
          <tr>
            <td colspan="3"><strong style="text-decoration:underline; text-underline-offset:5px;">RETURN</strong></td>
          </tr>

          <tr><td height="10"></td></tr>

          <tr>
            <td><strong>From</strong><br/>${body.returnPickupLocation}</td>
            <td><strong>To</strong><br/>${body.returnDropoffLocation}</td>
            <td><strong>Passengers</strong><br/>${body.passengers}</td>
          </tr>

          <tr>
            <td><strong>Vehicle</strong><br/>${body.vehicleType}</td>
            <td><strong>Pick-up Time</strong><br/>${body.returnPickupTime}</td>
            <td><strong>Date</strong><br/>${body.returnPickupDate}</td>
          </tr>
        </table>
        ` : ""}

      </td>
    </tr>

    <!-- PRICE -->
    <tr>
      <td style="padding:20px;">
        <h3 style="font-size:18px;">Price Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
        <tr>
          <td style="border-top:2px solid #e5e7eb;"></td>
        </tr>
        </table>
        <table width="100%" style="font-size:14px;">
          <tr>
            <td>Subtotal</td>
            <td align="right">$${body.transaction_amount} MXN</td>
          </tr>

          <tr>
            <td>Additional Service</td>
            <td align="right">$${body.additionalService || 0} MXN</td>
          </tr>

          <tr>
            <td><strong>Total</strong></td>
            <td align="right"><strong>$${body.transaction_amount} MXN</strong></td>
          </tr>

          <tr>
            <td>Paid Amount</td>
            <td align="right">$${body.transaction_amount} MXN</td>
          </tr>

          <tr>
            <td><strong style=" font-size:16px;">To Pay</strong></td>
            <td align="right"><strong style=" font-size:16px;">$0.00 MXN</strong></td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
   <!-- IMPORTANT -->
    <tr>
      <td style="background:#ffffff; padding:16px 20px; font-size:12px; color:#92400e;">
        <strong>Important:</strong> If applicable, please arrive at least 10 minutes early. A maximum wait time of 15 minutes after scheduled pickup is allowed. Changes or cancellations must be requested at least 8 hours in advance. Keep this email as your official receipt.
      </td>
    </tr>

    <!-- TERMS -->
    <tr>
      <td style="background:#ffffff; padding:16px 20px; font-size:12px; color:#374151;">
        <strong>Terms & Conditions:</strong> This ticket is personal and non-transferable. Must be presented at boarding. Lost or damaged tickets may be considered invalid. Valid only for the date and time shown. Changes must be requested at least 8 hours in advance and are subject to availability. Cancellations must be made at least 8 hours in advance to qualify for a refund. Any damage caused inside the vehicle will result in additional charges. Cabo101 reserves the right to deny service to anyone posing a risk to others or the operation.
      </td>
    </tr>

    <!-- CONTACT -->
    <tr>
      <td style="background:#d4f5e7; padding:16px 20px; font-size:12px; text-align:center;">
        +52 (624) 320 98 77 • booking@cabo101.com.mx • +52 (624) 174 63 53 
      </td>
    </tr>

  </table>

</div>
`;

      // Enviar al cliente
      await resend.emails.send({
        from: "Cabo101 <no-reply@cabo101.com.mx>",
        to: body.email,
        subject: `Booking Confirmation - ${folio}`,
        html,
      });

      // Enviar al administrador
      await resend.emails.send({
        from: "Cabo101 <no-reply@cabo101.com.mx>",
        to: "cabo101guide@gmail.com",
        subject: `New Booking - ${folio}`,
        html,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}