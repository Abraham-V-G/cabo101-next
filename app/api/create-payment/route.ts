import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { amount, name, email, service } = await req.json();

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `service-${Date.now()}`,
            title: service || "Servicio",
            quantity: 1,
            unit_price: Number(amount),
          },
        ],
        payer: {
          name,
          email,
        },
        metadata: {
          customer_name: name,
          service,
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
      },
    });

    // 🔥 LINK CON DATOS
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/pay?amount=${amount}&name=${name}&email=${email}&service=${service}&pref_id=${result.id}`;

    return NextResponse.json({ url });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}