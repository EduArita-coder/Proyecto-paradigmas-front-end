import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("paymentId");
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar el carrito local una vez confirmado el pago
    clearCart().catch(() => {});
  }, [clearCart]);

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-16 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-center shadow-2xl">
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-emerald-400">
          ✓
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">
          ¡Pago Exitoso!
        </h1>

        <p className="text-slate-300 text-sm mb-6">
          Tu transacción se ha completado con éxito y tu servidor está siendo procesado.
        </p>

        {token && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-6 text-left">
            <span className="text-slate-400 text-xs block uppercase font-semibold">
              ID de Referencia:
            </span>
            <span className="text-cyan-400 font-mono text-xs break-all">
              {token}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/historial"
            className="w-full py-3 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all shadow-lg text-sm"
          >
            Ver Historial de Transacciones
          </Link>
          <Link
            to="/"
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold rounded-xl border border-white/10 transition-colors text-sm"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
