// Helper de sanitización mejorado (escapa &, <, >, ", ')
function safe(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");  // <- Mejora 1: escapar comillas simples
}

// Tipo para los datos del email
export type BookingEmailData = {
  pickupDate?: string;
  id?: string | number;
  roundTrip?: boolean;
  name?: string;
  phone?: string;
  email?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  passengers?: string | number;
  vehicleType?: string;
  pickupTime?: string;
  returnPickupLocation?: string;
  returnDropoffLocation?: string;
  returnPickupTime?: string;
  returnPickupDate?: string;
  subtotal: number;
  additionalService: number;
  total: number;
  paidAmount: number;
  toPay: number;
};

export function bookingConfirmationTemplate(data: BookingEmailData): string {
  // Función auxiliar para formatear números de forma segura (Mejora 2)
  const formatPrice = (
    value: number | undefined | null
    ): string => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number.toFixed(2)
        : "0.00";
    };

  return `
<div style="font-family: 'Trebuchet MS', Tahoma, sans-serif; background:#f3f4f6; padding:20px;">
  <!-- MAIN TABLE -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; margin:auto; background:white; border-radius:12px; overflow:hidden; border-collapse:collapse;">
    
    <!-- HEADER -->
    <tr>
      <td style="background:#d4f5e7; padding:25px;">
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td>
              <h2 style="margin:0; color:#1f2937; font-size:25px;">
                Your Transfer <br/> Is Confirmed <img src="https://cabo101.com.mx/images/palomita.png" width="20" style="vertical-align:middle; margin-left:6px;"/>
              </h2>
              <p style="margin-top:10px; color:#374151; font-size:12px;">
                Thank you for choosing CABO 101. <br/>
                Our driver will be ready for you.
              </p>
            </td>
            <td align="right">
              <img
                src="https://cabo101.com.mx/images/logo-color.png"
                width="80"
                alt="Cabo101 Logo"
                style="display:block; border:0;"
                />
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- INFO -->
    <tr>
      <td style="padding:20px;">
        <table width="100%" style="font-size:14px; border-collapse:collapse;">
          <tr>
            <td><strong>Booking Date</strong><br/>${safe(data.pickupDate)}</td>
            <td><strong>Folio</strong><br/>${safe(data.id)}</td>
            <td><strong>Service Type</strong><br/>${data.roundTrip ? "Round Trip" : "One way"}</td>
          </tr>
          <tr><td height="15"></td></tr>
          <tr>
            <td><strong>Name</strong><br/>${safe(data.name)}</td>
            <td><strong>Phone</strong><br/>${safe(data.phone)}</td>
            <td><strong>Email</strong><br/>${safe(data.email)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SERVICE -->
    <tr>
      <td style="padding:20px;">
        <h3 style="margin-bottom:10px; font-size:18px;">Transportation Service</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0; border-collapse:collapse;">
          <tr><td style="border-top:2px solid #e5e7eb;"></td></tr>
        </table>
        <!-- OUTBOUND -->
        <table width="100%" style="font-size:13px; border-collapse:collapse;">
          <tr><td colspan="3"><strong style="text-decoration:underline; text-underline-offset:5px;">OUTBOUND</strong></td></tr>
          <tr><td height="10"></td></tr>
          <tr>
            <td><strong>From</strong><br/>${safe(data.pickupLocation)}</td>
            <td><strong>To</strong><br/>${safe(data.dropoffLocation)}</td>
            <td><strong>Passengers</strong><br/>${safe(data.passengers)}</td>
          </tr>
          <tr>
            <td><strong>Vehicle</strong><br/>${safe(data.vehicleType)}</td>
            <td><strong>Pick-up Time</strong><br/>${safe(data.pickupTime)}</td>
            <td><strong>Date</strong><br/>${safe(data.pickupDate)}</td>
          </tr>
        </table>
        ${data.roundTrip ? `
        <br/>
        <!-- RETURN -->
        <table width="100%" style="font-size:13px; border-collapse:collapse;">
          <tr><td colspan="3"><strong style="text-decoration:underline; text-underline-offset:5px;">RETURN</strong></td></tr>
          <tr><td height="10"></td></tr>
          <tr>
            <td><strong>From</strong><br/>${safe(data.returnPickupLocation)}</td>
            <td><strong>To</strong><br/>${safe(data.returnDropoffLocation)}</td>
            <td><strong>Passengers</strong><br/>${safe(data.passengers)}</td>
          </tr>
          <tr>
            <td><strong>Vehicle</strong><br/>${safe(data.vehicleType)}</td>
            <td><strong>Pick-up Time</strong><br/>${safe(data.returnPickupTime)}</td>
            <td><strong>Date</strong><br/>${safe(data.returnPickupDate)}</td>
          </tr>
        </table>
        ` : ""}
      </td>
    </tr>

    <!-- PRICE DETAILS -->
    <tr>
      <td style="padding:20px;">
        <h3 style="font-size:18px;">Price Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0; border-collapse:collapse;">
          <tr><td style="border-top:2px solid #e5e7eb;"></td></tr>
        </table>
        <table width="100%" style="font-size:14px; border-collapse:collapse;">
          <tr>
            <td>Subtotal</td>
            <td align="right">$${formatPrice(data.subtotal)} MXN</td>
          </tr>
          <tr>
            <td>Additional Service</td>
            <td align="right">$${formatPrice(data.additionalService)} MXN</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td align="right"><strong>$${formatPrice(data.total)} MXN</strong></td>
          </tr>
          <tr>
            <td>Paid Amount</td>
            <td align="right">$${formatPrice(data.paidAmount)} MXN</td>
          </tr>
          <tr>
            <td><strong style="font-size:16px;">To Pay</strong></td>
            <td align="right"><strong style="font-size:16px;">$${formatPrice(data.toPay)} MXN</strong></td>
          </tr>
        </table>
      </td>
    </tr>

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

  </table> <!-- FIN MAIN TABLE -->
</div>
`;
}