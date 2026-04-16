import "./globals.css";
import { Manrope } from "next/font/google";
import MercadoPagoProvider from "@/components/MercadoPagoProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* GOOGLE MAPS */}
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          async
        ></script>
      </head>

      <body className={manrope.className}>
        
        {/* 🔥 INIT MERCADOPAGO GLOBAL */}
        <MercadoPagoProvider />

        {children}
      </body>
    </html>
  );
}