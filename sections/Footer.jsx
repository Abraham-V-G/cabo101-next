export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white py-12 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-3 text-lg">Contacto</h3>
            <p>+1 (234) 567-8900</p>
            <p>info@cabo101.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-lg">Síguenos</h3>
            <p>Instagram</p>
            <p>Facebook</p>
          </div>
        </div>
        <p className="mt-8 text-sm opacity-70 text-center sm:text-left">
          © 2026 Cabo 101. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}