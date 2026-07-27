import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Catálogo", href: "#catalogo" },
    { label: "Carrito", href: "#carrito" },
    { label: "Historial", href: "#historial" },
  ];

  return (
    <nav className="bg-slate-900 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">GameHosting</span>

        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-blue-400 transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          =
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-3 mt-4 md:hidden">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-blue-400 transition-colors" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
