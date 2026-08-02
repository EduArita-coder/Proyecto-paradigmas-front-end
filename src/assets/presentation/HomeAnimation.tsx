import type { HTMLAttributes } from "react";
import { Link } from "react-router-dom";

interface HomeAnimationProps extends HTMLAttributes<HTMLDivElement> {
  fullPage?: boolean;
}

export default function HomeAnimation({ className = "", fullPage = false, ...props }: HomeAnimationProps) {
  return (
    <div className={fullPage ? "h-[calc(100vh-64px)] flex items-center justify-center" : undefined}>
      <div
        className={`product-card max-w-4xl w-full mx-6 rounded-2xl shadow-2xl z-100 relative cursor-pointer snap-start shrink-0 py-10 px-14 bg-slate-900/80 backdrop-blur-md border border-white/10 flex flex-row items-center justify-between gap-10 transition-all duration-300 group overflow-visible ${className}`}
        {...props}
      >
        <div className="flex flex-col gap-5 flex-1 z-30">
        <h2 className="text-3xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wide">
          GameHosting
        </h2>

        <p className="text-slate-200 text-base leading-relaxed font-medium max-w-sm">
          Host de alojamiento para distintos juegos, con recursos de alta calidad 24/7.
        </p>

        {/* Características */}
        <ul className="flex flex-col gap-3 mt-1">
          <li className="inline-flex gap-3 items-center">
            <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5"
              className="stroke-cyan-400" fill="none" viewBox="0 0 24 24"
              height="18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p className="text-sm font-semibold text-slate-300">Servidores dedicados 24/7</p>
          </li>
          <li className="inline-flex gap-3 items-center">
            <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5"
              className="stroke-cyan-400" fill="none" viewBox="0 0 24 24"
              height="18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p className="text-sm font-semibold text-slate-300">Minecraft, Rust, CS2 y más</p>
          </li>
          <li className="inline-flex gap-3 items-center">
            <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5"
              className="stroke-cyan-400" fill="none" viewBox="0 0 24 24"
              height="18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p className="text-sm font-semibold text-slate-300">Hardware confiable de alta calidad</p>
          </li>
          <li className="inline-flex gap-3 items-center">
            <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5"
              className="stroke-cyan-400" fill="none" viewBox="0 0 24 24"
              height="18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p className="text-sm font-semibold text-slate-300">Conexión estable y de baja latencia</p>
          </li>
        </ul>
      <Link to  = "/catalogo" >
        <button
          className="mt-2 w-fit px-6 py-2.5 rounded-lg font-semibold text-sm text-white
            bg-linear-to-r from-blue-500 to-cyan-500 shadow-lg
            opacity-0 translate-y-3
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-400 ease-out
            hover:from-blue-400 hover:to-cyan-400 hover:shadow-cyan-500/30 hover:shadow-xl
            "
        >
          Explorar Servicios
        </button>
        </Link>
      </div>

      <div className="relative w-72 h-72 shrink-0 flex items-center justify-center">
        <img
          src="Images/Steve.png"
          alt="Steve"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
    </div>
  );
}
