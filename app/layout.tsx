import "./globals.css";
import { Manrope } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
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
      <body className={manrope.className}>
        {/* Barra de progreso arriba de la página en cada navegación entre
            rutas (estilo YouTube/GitHub). Requiere instalar el paquete:
              npm install nextjs-toploader */}
        <NextTopLoader color="#4ccb8c" height={3} showSpinner={false} />

        {/* Google Maps: antes era un <script> crudo dentro de <head>.
            next/script con strategy="afterInteractive" lo carga después
            de que la página ya es interactiva (no compite con el render
            inicial), y Next.js evita que se duplique entre navegaciones
            de cliente. */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />

        <MercadoPagoProvider /> {/* Inicializa MercadoPago */}
        {children}
      </body>
    </html>
  );
}