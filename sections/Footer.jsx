export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        
        {/* Sección Principal - Estructura de 3 columnas limpias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Columna 1: Identidad (Ocupa 4 columnas de 12) */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start gap-2">
            <h2 className="text-3xl font-bold tracking-wider">
              CABO 101
            </h2>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-medium">
              Luxury Experiences
            </p>
          </div>

          {/* Columna 2: Contacto (Ocupa 5 columnas de 12) */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start gap-5 text-sm">
            
            {/* Teléfono */}
            <a
              href="tel:+12345678900"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-white/40 group-hover:text-white transition-colors"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span className="tracking-wide">+1 (234) 567-8900</span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@cabo101.com"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-white/40 group-hover:text-white transition-colors"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="tracking-wide">info@cabo101.com</span>
            </a>

            {/* Ubicación */}
            <div className="flex items-center gap-3 text-white/40">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="tracking-wide">Los Cabos, MX</span>
            </div>
          </div>

          {/* Columna 3: Redes Sociales con texto (Ocupa 3 columnas de 12) */}
          <div className="lg:col-span-3 flex flex-row md:flex-col justify-center md:items-start lg:items-end gap-6 md:gap-4 text-sm">
            
            {/* Instagram */}
            <a
              href="#"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-white/40 group-hover:text-white transition-colors"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span className="tracking-wide">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href="#"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-white/40 group-hover:text-white transition-colors"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span className="tracking-wide">Facebook</span>
            </a>
          </div>

        </div>

        {/* Sección Inferior (Copyright) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-medium">
          <p>© {new Date().getFullYear()} Cabo 101.</p>

          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Términos
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}