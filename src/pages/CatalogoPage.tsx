export default function CatalogoPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Nuestros Servidores
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Elige el juego y el plan que mejor se adapte a tu comunidad.
        </p>

        {/* Placeholder grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex flex-col items-center justify-center min-h-[280px] text-slate-500"
            >
              <span className="text-5xl mb-4">🎮</span>
              <p className="text-sm">Próximamente</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
