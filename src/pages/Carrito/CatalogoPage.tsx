import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos, deleteProducto } from "../../services/apiService";
import type { Producto } from "../../interfaces/product";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import ProductCard from "../../components/ProductCard";

export default function CatalogoPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { addItem } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "No se pudo establecer conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = async (product: Producto) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addItem(product);
      showToast(`¡${product.name} fue agregado al carrito!`, "success");
    } catch (err: any) {
      showToast(err.message || "No se pudo agregar el producto al carrito", "error");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProducto(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      showToast("Producto eliminado correctamente", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Error al eliminar el producto.", "error");
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12 relative">
      <div className="max-w-6xl mx-auto">
        {/* Floating Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 transition-all animate-bounce ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/90 border-red-500/40 text-red-200"
            }`}
          >
            <span>{toast.type === "success" ? "🛒" : "⚠️"}</span>
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Nuestros Servidores
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Elige el juego y el plan que mejor se adapte a tu comunidad.
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400 text-lg font-medium animate-pulse">
              Cargando servidores disponibles...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-md">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-bold text-white mb-2">
              Error al cargar el catálogo
            </h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-semibold text-sm cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-md">
            <span className="text-5xl mb-4 block">
              <img className="min-h-2 mx-auto" src="Images/Steve.png" alt="Sin productos" />
            </span>
            <h3 className="text-xl font-bold text-white mb-2">
              No hay planes disponibles
            </h3>
            <p className="text-slate-400">
              Próximamente agregaremos nuevos servidores a nuestro catálogo.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAdd}
                isAdmin={isAdmin}
                onDelete={isAdmin ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}