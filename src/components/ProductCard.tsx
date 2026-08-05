import { useState } from "react";
import type { Producto } from "../interfaces/product";

interface ProductCardProps {
  product: Producto;
  onAdd: (product: Producto) => Promise<void> | void;
  isAdmin?: boolean;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ product, onAdd, isAdmin = false, onDelete }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleAddClick = async () => {
    try {
      setAdding(true);
      await onAdd(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Error manejado en componente padre
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-xl group">
      <div>
        {product.imageUrl ? (
          <div className="h-32 w-full overflow-hidden rounded-xl bg-slate-950 mb-4 border border-white/5 relative flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/0f172a/ffffff?text=" + encodeURIComponent(product.name);
              }}
            />
          </div>
        ) : (
          <div className="h-32 w-full rounded-xl bg-slate-950 flex items-center justify-center mb-4 border border-white/5 text-5xl">
            
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-10">
          {product.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white/5 rounded-xl p-3 mb-6 border border-white/5">
          <div>
            <span className="block text-slate-500 font-semibold uppercase text-[10px]">CPU</span>
            <span className="text-slate-200 font-medium">{product.cpu}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-semibold uppercase text-[10px]">RAM</span>
            <span className="text-slate-200 font-medium">{product.ram}</span>
          </div>
          <div>
            <span className="block text-slate-500 font-semibold uppercase text-[10px]">Slots</span>
            <span className="text-slate-200 font-medium">{product.slots}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-slate-500 text-xs font-medium">Por mes</span>
          <span className="text-2xl font-extrabold text-blue-400">
            {formattedPrice}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddClick}
            disabled={adding}
            className={`w-full py-2.5 px-4 font-semibold rounded-lg shadow-lg transition-all duration-200 cursor-pointer text-center text-sm ${
              added
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white hover:shadow-cyan-500/20"
            } disabled:opacity-60`}
          >
            {adding ? "Agregando..." : added ? "✓ ¡Agregado al Carrito!" : "Agregar al Carrito"}
          </button>

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/20 transition-all duration-200 cursor-pointer text-center text-sm"
            >
              Eliminar producto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
