import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../../services/apiService";
import type { Producto } from "../../interfaces/product";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import ProductCard from "../../components/ProductCard";
import EditProductModal from "../../components/Admin/EditProductModal";

export default function CatalogoPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin" || user?.userName?.toLowerCase() === "admin";

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
    addItem(product);
    showToast(`"${product.name}" agregado al carrito`, "success");
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Producto) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProducto(id);
      showToast("Producto eliminado correctamente", "warning");
      fetchProducts();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Error al eliminar producto", "error");
    }
  };

  const handleSaveProduct = async (productData: Omit<Producto, "id">, id?: string) => {
    if (id) {
      await updateProducto(id, productData);
      showToast("Servidor actualizado con éxito", "success");
    } else {
      await createProducto(productData);
      showToast("Nuevo servidor creado con éxito", "success");
    }
    fetchProducts();
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Nuestros Servidores
            </h1>
            <p className="text-slate-400 text-base">
              Elige el juego y el plan que mejor se adapte a tu comunidad.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>➕ Agregar Nuevo Plan</span>
            </button>
          )}
        </div>

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
            <span className="text-5xl mb-4 block">🎮</span>
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
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      <EditProductModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </main>
  );
}