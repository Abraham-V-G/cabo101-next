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
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation – Cabo101</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
 
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
  <tr>
    <td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">
 
        <!-- ══ HEADER ══════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d5c55 0%,#0f766e 60%,#14b8a6 100%);
                      border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
            <img src="https://cabo101.com.mx/images/logo-color.png" width="68"
                 alt="Cabo101" style="margin-bottom:14px;filter:brightness(0) invert(1);"/>
            <div style="display:inline-block;background:rgba(255,255,255,0.15);
                        border-radius:50px;padding:5px 18px;margin-bottom:12px;">
              <span style="color:#a7f3d0;font-size:11px;letter-spacing:2px;
                           text-transform:uppercase;font-weight:700;">
                ✓ &nbsp;Booking Confirmed
              </span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.5px;">
              Your Transfer is All Set!
            </h1>
            <p style="color:#ccfbf1;font-size:13px;margin:8px 0 0;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </td>
         </tr>
 
        <!-- ══ FOLIO BANNER ═════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#0d5c55;padding:10px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="color:#ccfbf1;font-size:12px;text-transform:uppercase;
                               letter-spacing:1px;">Folio</span>&nbsp;
                  <span style="color:#ffffff;font-size:14px;font-weight:800;
                               font-family:monospace;">${folio}</span>
                </td>
                <td align="right">
                  <span style="display:inline-block;background:#14b8a6;color:#ffffff;
                               font-size:11px;font-weight:700;padding:3px 12px;
                               border-radius:20px;text-transform:uppercase;letter-spacing:1px;">
                    ${tripType}
                  </span>
                </td>
               </tr>
             </table>
            </div>
          </td>
        </tr>
 
        <!-- ══ BODY ══════════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#ffffff;padding:32px 40px;">
 
            <!-- Greeting -->
            <p style="font-size:16px;color:#1f2937;margin:0 0 6px;">
              Hello, <strong style="color:#0f766e;">${body.name || "Guest"}</strong> 
            </p>
            <p style="font-size:14px;color:#6b7280;margin:0 0 28px;line-height:1.6;">
              Thank you for choosing <strong>Cabo101 Transportation</strong>.
              Your booking is confirmed and our driver will be ready for you.
              Please keep this email as your official voucher.
            </p>
 
            <!-- ── CLIENT INFO ──────────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8fafc;border:1px solid #e2e8f0;
                          border-radius:12px;margin-bottom:20px;overflow:hidden;">
              <tr>
                <td style="background:#1e293b;padding:11px 20px;">
                  <span style="color:#fff;font-size:11px;font-weight:700;
                               letter-spacing:1.5px;text-transform:uppercase;">
                    👤 Client Information
                  </span>
                </td>
               </tr>
              <tr>
                <td style="padding:18px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding:5px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Name</span><br/>
                        <span style="font-size:14px;color:#1f2937;font-weight:600;">${body.name || "Guest"}</span>
                       </td>
                      <td width="50%" style="padding:5px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Phone</span><br/>
                        <span style="font-size:14px;color:#1f2937;font-weight:600;">${phone}</span>
                       </td>
                     </tr>
                    <tr>
                      <td colspan="2" style="padding-top:12px;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Email</span><br/>
                        <span style="font-size:14px;color:#0f766e;font-weight:600;">${body.email}</span>
                       </td>
                     </tr>
                  </table>
                 </td>
               </tr>
            </table>
 
            <!-- ── OUTBOUND TRIP ────────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8fafc;border:1px solid #e2e8f0;
                          border-radius:12px;margin-bottom:20px;overflow:hidden;">
              <tr>
                <td style="background:#0f766e;padding:11px 20px;">
                  <span style="color:#fff;font-size:11px;font-weight:700;
                               letter-spacing:1.5px;text-transform:uppercase;">
                     Outbound Trip
                  </span>
                 </td>
               </tr>
              <tr>
                <td style="padding:20px;">
 
                  <!-- Route visual -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
                    <tr>
                      <td width="44%" style="background:#ecfdf5;border-radius:8px;padding:12px 14px;
                                             border:1px solid #d1fae5;">
                        <span style="font-size:10px;color:#6b7280;text-transform:uppercase;
                                     letter-spacing:0.8px;">From</span><br/>
                        <span style="font-size:14px;color:#1f2937;font-weight:700;">${pickupLocation}</span>
                       </td>
                      <td width="12%" align="center">
                        <span style="font-size:20px;color:#0f766e;">→</span>
                       </td>
                      <td width="44%" style="background:#ecfdf5;border-radius:8px;padding:12px 14px;
                                             border:1px solid #d1fae5;">
                        <span style="font-size:10px;color:#6b7280;text-transform:uppercase;
                                     letter-spacing:0.8px;">To</span><br/>
                        <span style="font-size:13px;color:#1f2937;font-weight:700;">
                          ${dropoffLocation}
                        </span>
                       </td>
                     </tr>
                  </table>
 
                  <!-- Trip details grid -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="33%" style="padding:6px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Passengers</span><br/>
                        <span style="font-size:20px;font-weight:800;color:#0f766e;">${passengers}</span>
                       </td>
                      <td width="33%" style="padding:6px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Vehicle</span><br/>
                        <span style="font-size:15px;font-weight:700;color:#1f2937;">🚙 ${vehicleType}</span>
                       </td>
                      <td width="33%" style="padding:6px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Pickup Time</span><br/>
                        <span style="font-size:15px;font-weight:700;color:#1f2937;"> ${pickupTime}</span>
                       </td>
                     </tr>
                    <tr>
                      <td colspan="3" style="padding-top:12px;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Date</span><br/>
                        <span style="font-size:15px;font-weight:700;color:#1f2937;">
                           ${pickupDate}
                        </span>
                       </td>
                     </tr>
                  </table>
 
                 </td>
               </tr>
            </table>
 
            <!-- ── RETURN TRIP (si aplica) ─────────────────────────────── -->
            ${roundTrip ? `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8fafc;border:1px solid #e2e8f0;
                          border-radius:12px;margin-bottom:20px;overflow:hidden;">
              <tr>
                <td style="background:#475569;padding:11px 20px;">
                  <span style="color:#fff;font-size:11px;font-weight:700;
                               letter-spacing:1.5px;text-transform:uppercase;">
                     Return Trip
                  </span>
                 </td>
               </tr>
              <tr>
                <td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
                    <tr>
                      <td width="44%" style="background:#ecfdf5;border-radius:8px;padding:12px 14px;
                                             border:1px solid #d1fae5;">
                        <span style="font-size:10px;color:#6b7280;text-transform:uppercase;
                                     letter-spacing:0.8px;">From</span><br/>
                        <span style="font-size:14px;color:#1f2937;font-weight:700;">${returnPickupLocation || "N/A"}</span>
                       </td>
                      <td width="12%" align="center">→</td>
                      <td width="44%" style="background:#ecfdf5;border-radius:8px;padding:12px 14px;
                                             border:1px solid #d1fae5;">
                        <span style="font-size:10px;color:#6b7280;text-transform:uppercase;
                                     letter-spacing:0.8px;">To</span><br/>
                        <span style="font-size:13px;color:#1f2937;font-weight:700;">${returnDropoffLocation || "N/A"}</span>
                       </td>
                     </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding:6px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Pickup Time</span><br/>
                        <span style="font-size:15px;font-weight:700;color:#1f2937;"> ${returnPickupTime || "N/A"}</span>
                       </td>
                      <td width="50%" style="padding:6px 0;">
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">Date</span><br/>
                        <span style="font-size:15px;font-weight:700;color:#1f2937;">${returnPickupDate || "N/A"}</span>
                       </td>
                     </tr>
                  </table>
                 </td>
               </tr>
            </table>
            ` : `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8fafc;border:1px solid #e2e8f0;
                          border-radius:12px;margin-bottom:20px;overflow:hidden;">
              <tr>
                <td style="background:#475569;padding:11px 20px;">
                  <span style="color:#fff;font-size:11px;font-weight:700;
                               letter-spacing:1.5px;text-transform:uppercase;">
                     Return Trip
                  </span>
                 </td>
               </tr>
              <tr>
                <td style="padding:16px 20px;text-align:center;">
                  <span style="font-size:13px;color:#9ca3af;font-style:italic;">
                    Not applicable for this booking
                  </span>
                 </td>
               </tr>
            </table>
            `}
 
            <!-- ── COST BREAKDOWN ───────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8fafc;border:1px solid #e2e8f0;
                          border-radius:12px;margin-bottom:20px;overflow:hidden;">
              <tr>
                <td style="background:#0f766e;padding:11px 20px;">
                  <span style="color:#fff;font-size:11px;font-weight:700;
                               letter-spacing:1.5px;text-transform:uppercase;">
                     Cost Summary (MXN)
                  </span>
                 </td>
               </tr>
              <tr>
                <td style="padding:18px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#6b7280;">Subtotal</span>
                       </td>
                      <td align="right" style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#1f2937;font-weight:600;">$${subtotal.toFixed(2)}</span>
                       </td>
                     </tr>
                    <tr>
                      <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#6b7280;">Additional Service</span>
                       </td>
                      <td align="right" style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#1f2937;">$${additionalService.toFixed(2)}</span>
                       </td>
                     </tr>
                    <tr>
                      <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#6b7280;">Total</span>
                       </td>
                      <td align="right" style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#1f2937;font-weight:600;">$${total.toFixed(2)}</span>
                       </td>
                     </tr>
                    <tr>
                      <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#6b7280;">Paid Amount</span>
                       </td>
                      <td align="right" style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                        <span style="font-size:13px;color:#16a34a;font-weight:600;">$${paidAmount.toFixed(2)}</span>
                       </td>
                     </tr>
                    <tr>
                      <td style="padding:12px 0 4px;">
                        <span style="font-size:15px;color:#1f2937;font-weight:800;">To Pay</span>
                       </td>
                      <td align="right" style="padding:12px 0 4px;">
                        <span style="font-size:24px;color:#0f766e;font-weight:800;">
                          $${toPay.toFixed(2)}
                          <span style="font-size:13px;color:#9ca3af;font-weight:400;">MXN</span>
                        </span>
                       </td>
                     </tr>
                  </table>
 
                  <!-- We Accept -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                    <tr>
                      <td>
                        <span style="font-size:11px;color:#9ca3af;text-transform:uppercase;
                                     letter-spacing:0.8px;">We Accept</span><br/>
                        <span style="font-size:18px;margin-top:4px;display:inline-block;">
                           &nbsp;
                          <span style="font-size:13px;font-weight:700;color:#1f2937;">Apple Pay</span>
                          &nbsp;·&nbsp;
                          <span style="font-size:13px;font-weight:700;color:#2563eb;">VISA</span>
                          &nbsp;·&nbsp;
                          <span style="font-size:13px;font-weight:700;color:#ea580c;">Mastercard</span>
                          &nbsp;·&nbsp;
                          <span style="font-size:13px;font-weight:700;color:#1d4ed8;">Amex</span>
                        </span>
                       </td>
                     </tr>
                  </table>
 
                 </td>
               </tr>
            </table>
 
            <!-- ── NOTICE ────────────────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#fffbeb;border:1px solid #fde68a;
                          border-radius:10px;margin-bottom:20px;">
              <tr>
                <td style="padding:14px 18px;">
                  <p style="margin:0;font-size:13px;color:#92400e;line-height:1.7;">
                    <strong> Important:</strong> Please arrive at least <strong>10 minutes early</strong>.
                    A maximum wait time of <strong>15 minutes</strong> after scheduled pickup is allowed.
                    Changes or cancellations must be requested at least <strong>8 hours in advance</strong>.
                    Keep this email as your official receipt.
                  </p>
                 </td>
               </tr>
            </table>
 
            <!-- ── TERMS & CONDITIONS ────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f1f5f9;border:1px solid #e2e8f0;
                          border-radius:10px;margin-bottom:20px;">
              <tr>
                <td style="padding:14px 18px;">
                  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#374151;
                             text-transform:uppercase;letter-spacing:0.8px;">
                    Terms &amp; Conditions
                  </p>
                  <p style="margin:0;font-size:11.5px;color:#6b7280;line-height:1.7;">
                    This ticket is personal and non-transferable. Must be presented at boarding.
                    Lost or damaged tickets may be considered invalid. Valid only for the date and time shown.
                    Changes must be requested at least 8 hours in advance and are subject to availability.
                    Cancellations must be made at least 8 hours in advance to qualify for a refund.
                    Any damage caused inside the vehicle will result in additional charges.
                    Cabo101 reserves the right to deny service to anyone posing a risk to others or the operation.
                  </p>
                 </td>
               </tr>
            </table>
 
            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://cabo101.com.mx"
                     style="display:inline-block;background:#0f766e;color:#ffffff;
                            font-size:14px;font-weight:700;padding:13px 36px;
                            border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                    Visit Our Website →
                  </a>
                 </td>
               </tr>
            </table>
 
           </td>
         </tr>
 
        <!-- ══ FOOTER ═════════════════════════════════════════════════════ -->
        <tr>
          <td style="background:#111827;border-radius:0 0 16px 16px;
                      padding:26px 40px;text-align:center;">
            <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 4px;">
              Cabo101 Transportation
            </p>
            <p style="color:#9ca3af;font-size:12px;margin:0 0 6px;">
              Los Cabos, Baja California Sur, México
            </p>
            <p style="color:#6b7280;font-size:12px;margin:0 0 14px;">
              📞 +52 (624) 320-98-77 &nbsp;|&nbsp; +52 (624) 174-63-53<br/>
              ✉️ booking@cabo101.com.mx
            </p>
            <table align="center" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 8px;">
                  <a href="https://cabo101.com.mx"
                     style="color:#14b8a6;font-size:12px;text-decoration:none;">Website</a>
                 </td>
                <td style="color:#4b5563;font-size:12px;">|</td>
                <td style="padding:0 8px;">
                  <a href="mailto:booking@cabo101.com.mx"
                     style="color:#14b8a6;font-size:12px;text-decoration:none;">Contact Us</a>
                 </td>
               </tr>
            </table>
            <p style="color:#374151;font-size:11px;margin:14px 0 0;">
              © ${new Date().getFullYear()} Cabo101. All rights reserved.
            </p>
           </td>
         </tr>
 
      </table>
     </td>
   </tr>
</table>
 
</body>
</html>`;

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