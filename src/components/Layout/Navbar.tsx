import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const links = [
    { label: "Inicio", to: "/" },
    { label: "Catálogo", to: "/catalogo" },
    ...(isAuthenticated ? [{ label: "Mis Servidores", to: "/mis-servidores" }] : []),
    { label: cartItemsCount > 0 ? `Carrito (${cartItemsCount})` : "Carrito", to: "/carrito" },
    { label: "Historial", to: "/historial" },
    ...(isAdmin ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md text-white px-6 py-4 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          GameHosting
        </Link>

        <div className="hidden md:flex items-center gap-6">
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

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 font-medium">
                👤 {user?.userName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all shadow-md"
              >
                Registrarse
              </Link>
            </div>
          )}
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
        <div className="flex flex-col gap-3 mt-4 md:hidden max-w-6xl mx-auto pt-3 border-t border-white/10">
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

          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <span className="text-sm text-slate-300">
                👤 {user?.userName || user?.email}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left py-1 text-sm text-red-400"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-cyan-400"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-cyan-400 font-semibold"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

