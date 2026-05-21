"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50 flex justify-between items-center mb-12 text-white">
      
      {/* Logo */}
      <div>
        <Image
          src="/images/logo.png"
          alt="Cabo 101"
          width={43}
          height={43}
          className="object-contain"
        />
      </div>

      {/* Botón de Hamburguesa (Z-index alto para quedar por encima de la barra al abrirse) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 relative focus:outline-none min-[901px]:hidden"
        aria-label="Toggle Menu"
      >
        <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`h-0.5 w-6 bg-white rounded transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Fondo oscuro semi-transparente de apoyo (Se activa al abrir la barra) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 min-[901px]:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Barra Lateral Deslizante desde la derecha */}
      <div className={`
        /* Estilos de la barra lateral en móvil (< 900px) */
        fixed top-0 right-0 h-full w-[280px] bg-black/95 z-40 flex flex-col items-start justify-start pt-24 pl-10 gap-8 text-xl transition-transform duration-300 ease-in-out
        
        /* Comportamiento Desktop a partir de 901px */
        min-[901px]:static min-[901px]:h-auto min-[901px]:w-auto min-[901px]:bg-transparent min-[901px]:flex-row min-[901px]:items-center min-[901px]:gap-16 min-[901px]:text-lg min-[901px]:mr-22 min-[901px]:pt-0 min-[901px]:pl-0 min-[901px]:translate-x-0
        
        /* Control del deslizamiento en móvil */
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <a href="#" onClick={() => setIsOpen(false)} className="hover:text-[#4ccb8c] transition">Home</a>
        <a href="#" onClick={() => setIsOpen(false)} className="hover:text-[#4ccb8c] transition">Experiences</a>
        <a href="#" onClick={() => setIsOpen(false)} className="hover:text-[#4ccb8c] transition">About us</a>
        <a href="#" onClick={() => setIsOpen(false)} className="hover:text-[#4ccb8c] transition">Contact</a>
        <span className="cursor-pointer">☀</span>
      </div>

    </div>
  );
}