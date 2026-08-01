import { useEffect, useState } from 'react';
import { getProductos, addToCart } from '../services/apiService';
import type { Product } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProducts(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingId(productId);
      await addToCart(productId, 1);
      setMessage('¡Producto agregado al carrito!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error agregando producto:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Nuestros Servidores
            </h1>
            <p className="text-slate-400 text-lg">
              Elige el servidor perfecto para alojar tu comunidad con máximo rendimiento.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-medium">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 animate-pulse">
            Cargando catálogo...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-slate-500">
            <span className="text-5xl mb-4">🎮</span>
            <p>No hay servidores disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl"
              >
                <div>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-xl mb-4 border border-white/5"
                    />
                  )}
                  <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-6 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div>⚡ CPU: <span className="font-semibold text-cyan-400">{product.cpu}</span></div>
                    <div>🧠 RAM: <span className="font-semibold text-cyan-400">{product.ram}</span></div>
                    <div>👥 Slots: <span className="font-semibold text-cyan-400">{product.slots}</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-slate-400">Precio / mes</span>
                    <p className="text-2xl font-black text-white">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingId === product.id}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {addingId === product.id ? 'Añadiendo...' : 'Contratar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
