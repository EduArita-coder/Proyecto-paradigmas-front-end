import { useEffect, useState } from 'react';
import { getCart, updateCartItemQuantity, removeFromCart, clearCart } from '../services/apiService';
import type { Cart, CartItem } from '../services/apiService';
import { Link } from 'react-router-dom';

export default function CarritoPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error('Error al obtener el carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setActionLoading(true);
      await updateCartItemQuantity(productId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setActionLoading(true);
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error('Error al eliminar ítem:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setActionLoading(true);
      await clearCart();
      await fetchCart();
    } catch (err) {
      console.error('Error al vaciar carrito:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Carrito de Compras
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Revisa y gestiona los servidores seleccionados.
        </p>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 animate-pulse">
            Cargando carrito...
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-slate-500">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-lg text-slate-300 mb-4">Tu carrito está vacío</p>
            <Link
              to="/catalogo"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
              <div className="divide-y divide-white/10">
                {cart.items.map((item: CartItem) => (
                  <div key={item.productId} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-xl border border-white/10"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{item.productName}</h3>
                        <p className="text-sm text-cyan-400 font-semibold">${item.price.toFixed(2)} / mes</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={actionLoading || item.quantity <= 1}
                          className="px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={actionLoading}
                          className="px-2 py-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={actionLoading}
                        className="text-red-400 hover:text-red-300 p-2 cursor-pointer disabled:opacity-50"
                        title="Eliminar ítem"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-950/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleClear}
                  disabled={actionLoading}
                  className="text-sm text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Vaciar carrito
                </button>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Estimado</span>
                    <span className="text-2xl font-black text-cyan-400">${cart.total.toFixed(2)}</span>
                  </div>

                  <Link
                    to="/catalogo"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all shadow-md"
                  >
                    Seguir Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
