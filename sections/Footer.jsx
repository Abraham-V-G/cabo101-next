export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white py-16 px-8 md:px-20">

      <div className="grid md:grid-cols-2 gap-10">

        <div>
          <h3 className="font-semibold mb-4">Contacto</h3>
          <p>+1 (234) 567-8900</p>
          <p>info@cabo101.com</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Síguenos</h3>
          <p>Instagram</p>
          <p>Facebook</p>
        </div>

      </div>

      <p className="mt-10 text-sm opacity-70">
        © 2026 Cabo 101. Todos los derechos reservados.
      </p>

    </footer>
  );
}
