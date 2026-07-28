export default function CarritoPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Carrito de Compras
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Aquí aparecerán los planes que selecciones.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-slate-500">
          <span className="text-5xl mb-4">🛒</span>
          <p>Tu carrito está vacío</p>
        </div>
      </div>
    </main>
  );
}
