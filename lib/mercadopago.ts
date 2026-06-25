// lib/mercadopago.ts
import { MercadoPago } from '@mercadopago/sdk-react';

let initialized = false;

export function initMercadoPago() {
  if (initialized) return;
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  if (!publicKey) {
    console.warn('NEXT_PUBLIC_MP_PUBLIC_KEY no está definida');
    return;
  }
  MercadoPago.init({
    publicKey,
  });
  initialized = true;
  console.log('✅ MercadoPago SDK initialized');
}