import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-white">
        GameHosting
      </h1>

      <p className="mt-4 text-lg text-slate-300 max-w-xl">
        Aloja tu propio servidor dedicado para tus juegos favoritos.
        Hardware confiable, conexión estable y soporte para los juegos
        más populares como Minecraft, Rust, CS2 y más.
      </p>

      <button
        onClick={() => navigate("/catalogo")}
        className="mt-8 px-6 py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
      >
        Ver planes de hosting
      </button>
    </main>
  );
}
