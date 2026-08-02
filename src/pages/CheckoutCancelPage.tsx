import { Link } from "react-router-dom";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-16 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-center shadow-2xl">
        <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-amber-400">
          ✕
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">
          Pago Cancelado
        </h1>

        <p className="text-slate-300 text-sm mb-6">
          Has cancelado el proceso de pago. Tu carrito sigue guardado por si deseas completar tu pedido más tarde.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/carrito"
            className="w-full py-3 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all shadow-lg text-sm"
          >
            Volver al Carrito
          </Link>
          <Link
            to="/catalogo"
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold rounded-xl border border-white/10 transition-colors text-sm"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}
