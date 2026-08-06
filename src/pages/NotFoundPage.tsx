import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12 text-center">
      <div className="max-w-md w-full bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-5xl mb-6 shadow-inner">
          🎮
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-white mb-3">
          ¡Página no encontrada!
        </h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Parece que te has perdido en el servidor equivocado o la ruta especificada no existe en el sistema.
        </p>

        <Link
          to="/"
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}
