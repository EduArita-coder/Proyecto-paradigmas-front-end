import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Inicio", to: "/" },
    { label: "Catálogo", to: "/catalogo" },
    { label: "Carrito", to: "/carrito" },
    { label: "Historial", to: "/historial" },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md text-white px-6 py-4 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          GameHosting
        </Link>

        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`transition-colors ${
                location.pathname === link.to
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-300 hover:text-blue-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-3 mt-4 md:hidden max-w-6xl mx-auto">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`transition-colors ${
                location.pathname === link.to
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-300 hover:text-blue-400"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
