import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";
import { bookingConfirmationTemplate, BookingEmailData } from "@/lib/emailTemplates/bookingConfirmation";

// Validación de entorno
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("Missing MP_ACCESS_TOKEN environment variable");
}
if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.formData || body;

    // --- Validaciones obligatorias ---
    if (!data.email) {
      return NextResponse.json(
        { error: "Customer email missing" },
        { status: 400 }
      );
    }

    const total = Number(data.transaction_amount);
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid transaction amount" },
        { status: 400 }
      );
    }

    if (!data.token) {
      return NextResponse.json(
        { error: "Payment token missing" },
        { status: 400 }
      );
    }

    if (!data.payment_method_id) {
      return NextResponse.json(
        { error: "Payment method missing" },
        { status: 400 }
      );
    }

    // --- Validación de installments (mejora recomendada) ---
    const installments = Number(data.installments);
    if (!Number.isInteger(installments) || installments <= 0) {
      return NextResponse.json(
        { error: "Invalid installments" },
        { status: 400 }
      );
    }

    // Cálculos de precios
    const additionalService = Number(data.additionalService) || 0;
    const subtotal = Math.max(total - additionalService, 0);
    const paidAmount = Number(data.paidAmount) || total;
    const toPay = Math.max(total - paidAmount, 0);

    // Crear pago en Mercado Pago
    const payment = new Payment(mp);
    const result = await payment.create({
      body: {
        transaction_amount: total,
        token: data.token,
        installments,
        payment_method_id: data.payment_method_id,
        issuer_id: data.issuer_id,
        description: data.summary || "Transportation Service", // valor por defecto
        payer: {
          email: data.email,
          first_name: data.name,
        },
        metadata: {
          booking: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            pickupLocation: data.pickupLocation,
            dropoffLocation: data.dropoffLocation,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
            returnPickupLocation: data.returnPickupLocation,
            returnDropoffLocation: data.returnDropoffLocation,
            returnPickupDate: data.returnPickupDate,
            returnPickupTime: data.returnPickupTime,
            passengers: data.passengers,
            vehicleType: data.vehicleType,
            roundTrip: data.roundTrip,
            totalAmount: total,
            additionalService,
          },
        },
        binary_mode: true,
      },
    });

    // Solo si el pago fue aprobado
    if (result.status === "approved") {
      const folio = `#${result.id?.toString().slice(-6) || "000000"}`;

      console.log("BOOKING DATA:", {
        name: data.name,
        email: data.email,
        amount: total,
        paid: paidAmount,
        toPay,
        pickup: data.pickupLocation,
        dropoff: data.dropoffLocation,
        serviceType: data.roundTrip ? "Round Trip" : "One way",
        paymentStatus: result.status,
        paymentId: result.id,
      });

      const templateData: BookingEmailData = {
        pickupDate: data.pickupDate,
        id: result.id,
        roundTrip: data.roundTrip,
        name: data.name,
        phone: data.phone,
        email: data.email,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        passengers: data.passengers,
        vehicleType: data.vehicleType,
        pickupTime: data.pickupTime,
        returnPickupLocation: data.returnPickupLocation,
        returnDropoffLocation: data.returnDropoffLocation,
        returnPickupTime: data.returnPickupTime,
        returnPickupDate: data.returnPickupDate,
        subtotal,
        additionalService,
        total,
        paidAmount,
        toPay,
      };

      const html = bookingConfirmationTemplate(templateData);

      // Emails con manejo de errores (no afectan la respuesta)
      try {
        await resend.emails.send({
          from: "Cabo101 <no-reply@cabo101.com.mx>",
          to: data.email,
          subject: `Booking Confirmation - ${folio}`,
          html,
        });

        await resend.emails.send({
          from: "Cabo101 <no-reply@cabo101.com.mx>",
          to: "cabo101guide@gmail.com",
          subject: `New Booking - ${folio}`,
          html,
        });
      } catch (emailError) {
        console.error("EMAIL ERROR (no afecta el pago):", emailError);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("MP ERROR:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}