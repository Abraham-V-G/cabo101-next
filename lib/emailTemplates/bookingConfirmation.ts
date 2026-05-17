function safe(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
  const formatPrice = (value: number | undefined | null): string => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(2) : "0.00";
  };

  const field = (label: string, value: string) => `
    <span style="font-size:13px; color:#374151; font-weight:600; display:block; margin-bottom:3px;">${label}</span>
    <span style="font-size:12px; color:#1f2937;">${value}</span>
  `;

  return `
<div style="font-family: 'Trebuchet MS', Tahoma, sans-serif; background:#f3f4f6; padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; margin:auto; background:white; border-radius:12px; overflow:hidden; border-collapse:collapse;">

    <!-- HEADER -->
    <tr>
      <td style="background:#d4f5e7; padding:25px;">
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;">
              <h2 style="margin:0; color:#1f2937; font-size:25px; line-height:1.3;">
                Your Transfer <br/> Is Confirmed
                <img src="https://cabo101.com.mx/images/palomita.png" width="20" style="vertical-align:middle; margin-left:6px;"/>
              </h2>
              <p style="margin:10px 0 0 0; color:#374151; font-size:12px; line-height:1.6;">
                Thank you for choosing CABO 101. <br/>
                Our driver will be ready for you.
              </p>
            </td>
            <td style="width:110px; vertical-align:middle; text-align:center;">
              <img
                src="https://cabo101.com.mx/images/logo-color.png"
                width="80"
                alt="Cabo101 Logo"
                style="display:inline-block; border:0;"
              />
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- INFO -->
    <tr>
      <td style="padding:20px; border-bottom:1px solid #f3f4f6;">
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0 8px 0 0; width:33%;">${field("Booking Date", safe(data.pickupDate))}</td>
            <td style="padding:0 8px; width:33%;">${field("Folio", safe(data.id))}</td>
            <td style="padding:0 0 0 8px; width:33%;">${field("Service Type", data.roundTrip ? "Round Trip" : "One way")}</td>
          </tr>
          <tr><td height="14" colspan="3"></td></tr>
          <tr>
            <td style="padding:0 8px 0 0;">${field("Name", safe(data.name))}</td>
            <td style="padding:0 8px;">${field("Phone", safe(data.phone))}</td>
            <td style="padding:0 0 0 8px;">${field("Email", safe(data.email))}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SERVICE -->
    <tr>
      <td style="padding:20px;">
        <h3 style="margin:0 0 10px; font-size:18px; color:#1f2937;">Transportation Service</h3>
        <div style="border-top:2px solid #e5e7eb; margin-bottom:14px;"></div>

        <!-- OUTBOUND -->
        <p style="font-size:15px; font-weight:700; color:#374151; margin:0 0 10px; text-decoration:underline; text-underline-offset:4px;">OUTBOUND</p>
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0 8px 8px 0; width:33%;">${field("From", safe(data.pickupLocation))}</td>
            <td style="padding:0 8px 8px; width:33%;">${field("To", safe(data.dropoffLocation))}</td>
            <td style="padding:0 0 8px; width:33%;">${field("Passengers", safe(data.passengers))}</td>
          </tr>
          <tr>
            <td style="padding:0 8px 0 0;">${field("Vehicle", safe(data.vehicleType))}</td>
            <td style="padding:0 8px;">${field("Pick-up Time", safe(data.pickupTime))}</td>
            <td style="padding:0;">${field("Date", safe(data.pickupDate))}</td>
          </tr>
        </table>

        ${data.roundTrip ? `
        <div style="height:16px;"></div>

        <!-- RETURN -->
        <p style="font-size:15px; font-weight:700; color:#374151; margin:0 0 10px; text-decoration:underline; text-underline-offset:4px;">RETURN</p>
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0 8px 8px 0; width:33%;">${field("From", safe(data.returnPickupLocation))}</td>
            <td style="padding:0 8px 8px; width:33%;">${field("To", safe(data.returnDropoffLocation))}</td>
            <td style="padding:0 0 8px; width:33%;">${field("Passengers", safe(data.passengers))}</td>
          </tr>
          <tr>
            <td style="padding:0 8px 0 0;">${field("Vehicle", safe(data.vehicleType))}</td>
            <td style="padding:0 8px;">${field("Pick-up Time", safe(data.returnPickupTime))}</td>
            <td style="padding:0;">${field("Date", safe(data.returnPickupDate))}</td>
          </tr>
        </table>
        ` : ""}
      </td>
    </tr>

    <!-- PRICE DETAILS -->
    <tr>
      <td style="padding:20px; border-top:1px solid #f3f4f6;">
        <h3 style="margin:0 0 10px; font-size:18px; color:#1f2937;">Price Details</h3>
        <div style="border-top:2px solid #e5e7eb; margin-bottom:14px;"></div>
        <table width="100%" style="font-size:13px; border-collapse:collapse; color:#1f2937;">
          <tr>
            <td style="padding:5px 0; color:#374151;">Subtotal</td>
            <td align="right" style="padding:5px 0;">$${formatPrice(data.subtotal)} MXN</td>
          </tr>
          <tr>
            <td style="padding:5px 0; color:#374151;">Additional Service</td>
            <td align="right" style="padding:5px 0;">$${formatPrice(data.additionalService)} MXN</td>
          </tr>
          <tr>
            <td style="padding:5px 0; border-top:1px solid #e5e7eb; font-weight:600; color:#374151;">Total</td>
            <td align="right" style="padding:5px 0; border-top:1px solid #e5e7eb; font-weight:600;">$${formatPrice(data.total)} MXN</td>
          </tr>
          <tr>
            <td style="padding:5px 0; color:#374151;">Paid Amount</td>
            <td align="right" style="padding:5px 0;">$${formatPrice(data.paidAmount)} MXN</td>
          </tr>
          <tr>
            <td style="padding:8px 0 0; font-size:15px; font-weight:600; color:#374151;">To Pay</td>
            <td align="right" style="padding:8px 0 0; font-size:15px; font-weight:600; color:#059669;">$${formatPrice(data.toPay)} MXN</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- IMPORTANT -->
    <tr>
      <td style="background:#fffbeb; padding:16px 20px; font-size:12px; color:#92400e; border-top:1px solid #fde68a;">
        <strong>Important:</strong> If applicable, please arrive at least 10 minutes early. A maximum wait time of 15 minutes after scheduled pickup is allowed. Changes or cancellations must be requested at least 8 hours in advance. Keep this email as your official receipt.
      </td>
    </tr>

    <!-- TERMS -->
    <tr>
      <td style="background:#f9fafb; padding:16px 20px; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb;">
        <strong style="color:#374151;">Terms & Conditions:</strong> This ticket is personal and non-transferable. Must be presented at boarding. Lost or damaged tickets may be considered invalid. Valid only for the date and time shown. Changes must be requested at least 8 hours in advance and are subject to availability. Cancellations must be made at least 8 hours in advance to qualify for a refund. Any damage caused inside the vehicle will result in additional charges. Cabo101 reserves the right to deny service to anyone posing a risk to others or the operation.
      </td>
    </tr>

    <!-- CONTACT -->
    <tr>
      <td style="background:#d4f5e7; padding:16px 20px; font-size:12px; text-align:center; color:#065f46; font-weight:500; letter-spacing:0.03em;">
        +52 (624) 320 98 77 &nbsp;•&nbsp; +52 (624) 174 63 53 &nbsp;•&nbsp; booking@cabo101.com.mx
      </td>
    </tr>

  </table>
</div>
`;
}