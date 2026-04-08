import Image from "next/image";

export default function Navbar() {
  return (
    <div className="relative z-10 flex justify-between items-center mb-12 text-white">

      {/* Logo */}
      <div>
        <Image
            src="/images/logo.png"
            alt="Cabo 101"
            width={53}
            height={33}
            className="object-contain"
        />
        </div>

      {/* Links */}
      <div className="flex gap-8 text-lg mr-22">
        <a href="#">Home</a>
        <a href="#">Experiences</a>
        <a href="#">About us</a>
        <a href="#">Contact</a>
        <span>☀</span>
      </div>

    </div>
  );
}

