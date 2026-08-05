import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProducto, getProductos } from "../services/apiService";
import type { Producto } from "../interfaces/product";

export default function AdminPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "No se pudo cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProducto(id);
      setProducts(products.filter((product) => product.id !== id));
      setSuccess("Producto eliminado correctamente.");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al eliminar el producto.");
      setSuccess(null);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-slate-400">
              Revisa y administra los productos del catálogo. Puedes crear uno nuevo desde la página de creación.
            </p>
          </div>
          <Link
            to="/admin/crear"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
          >
            Crear producto
          </Link>
        </div>

        {loading && <p className="text-slate-400">Cargando productos...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-emerald-400 mb-4">{success}</p>}

        {!loading && products.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-slate-400">
            No hay productos en el catálogo.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">{product.description}</p>
              <div className="flex flex-wrap gap-2 text-slate-300 text-xs mb-4">
                <span className="rounded-full bg-white/5 px-3 py-1">CPU: {product.cpu}</span>
                <span className="rounded-full bg-white/5 px-3 py-1">RAM: {product.ram}</span>
                <span className="rounded-full bg-white/5 px-3 py-1">Slots: {product.slots}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300 text-sm">Precio: L {product.price}</span>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
