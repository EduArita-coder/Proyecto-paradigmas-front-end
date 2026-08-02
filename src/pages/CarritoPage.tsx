import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CarritoPage() {
  const { cart, loading, error, updateQuantity, removeItem, clearCart, checkout, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const res = await checkout();
      if (res && !res.approvalUrl) {
        navigate("/checkout/success");
      }
    } catch (err) {
      console.error("Error al procesar el pago:", err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Carrito de Compras
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Revisa y gestiona los servidores seleccionados.
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[250px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400 text-lg">Cargando tu carrito...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 text-center backdrop-blur-md">
            <span className="text-3xl mb-2 block">⚠️</span>
            <p className="text-red-400 font-semibold mb-1">Ocurrió un error</p>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && isCartEmpty && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-16 flex flex-col items-center justify-center text-slate-500 text-center">
            <span className="text-6xl mb-6">🛒</span>
            <h3 className="text-xl font-bold text-white mb-2">Tu carrito está vacío</h3>
            <p className="text-slate-400 max-w-sm mb-8">
              Parece que aún no has agregado ningún plan de hosting a tu carrito.
            </p>
            <a
              href="/catalogo"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-colors text-sm"
            >
              Explorar Catálogo
            </a>
          </div>
        )}

        {!loading && !isCartEmpty && cart && (
          <div className="flex flex-col gap-6">
            {/* Items List */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden">
              <div className="divide-y divide-white/10">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl text-blue-400 shrink-0">
                        🎮
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {item.productName || "Servidor Dedicado"}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Precio unitario: {formatPrice(item.unitPrice ?? item.price ?? 0)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 flex items-center justify-center font-bold transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-white font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 flex items-center justify-center font-bold transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="text-right sm:min-w-[100px]">
                        <span className="block text-slate-500 text-[10px] uppercase font-semibold">
                          Subtotal
                        </span>
                        <span className="font-bold text-white text-base">
                          {formatPrice(item.subtotal ?? (item.unitPrice ?? item.price ?? 0) * item.quantity)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer bg-red-500/5 hover:bg-red-500/10 p-2 rounded-lg border border-red-500/10"
                        title="Quitar del carrito"
                      >
                        🗑️ <span className="sm:inline hidden">Quitar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer / Totals */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                onClick={clearCart}
                className="w-full sm:w-auto px-5 py-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-sm font-semibold cursor-pointer"
              >
                Vaciar Carrito
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-end">
                <div className="text-center sm:text-right">
                  <span className="text-slate-400 text-sm font-medium mr-2">Total:</span>
                  <span className="text-2xl font-extrabold text-blue-400">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer text-sm text-center disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    "Proceder al Pago"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
