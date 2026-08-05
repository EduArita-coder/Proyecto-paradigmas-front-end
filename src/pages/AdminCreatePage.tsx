import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProducto } from "../services/apiService";

export default function AdminCreatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [slots, setSlots] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createProducto({
        name,
        description,
        price,
        imageUrl,
        cpu,
        ram,
        slots,
      });

      setSuccess("Producto creado correctamente.");
      setName("");
      setDescription("");
      setPrice(0);
      setImageUrl("");
      setCpu("");
      setRam("");
      setSlots(1);

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error al crear el producto.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white mb-2">Crear producto</h1>
        <p className="text-slate-400 mb-8">Rellena todos los campos para crear un nuevo producto en el catálogo.</p>

        {error && <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-200">{error}</p>}
        {success && <p className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-200">{success}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="flex flex-col gap-2 text-slate-300">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="Ej. Servidor Minecraft"
            />
          </label>

          <label className="flex flex-col gap-2 text-slate-300">
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none resize-none"
              placeholder="Describe el plan del servidor"
            />
          </label>

          <label className="flex flex-col gap-2 text-slate-300">
            Precio
            <input
              type="number"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min={1}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="Ej. 250"
            />
          </label>

          <label className="flex flex-col gap-2 text-slate-300">
            Imagen URL
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="https://..."
            />
          </label>

          <label className="flex flex-col gap-2 text-slate-300">
            CPU
            <input
              value={cpu}
              onChange={(e) => setCpu(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="Ej. 4 vCPUs"
            />
          </label>

          <label className="flex flex-col gap-2 text-slate-300">
            RAM
            <input
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="Ej. 8 GB"
            />
          </label>

          <label className="flex flex-col gap-2 text-slate-300">
            Slots
            <input
              type="number"
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              required
              min={1}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400 outline-none"
              placeholder="Ej. 50"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="rounded-2xl bg-cyan-500 px-6 py-3 text-white font-semibold hover:bg-cyan-400 transition"
            >
              Crear producto
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="rounded-2xl border border-white/10 px-6 py-3 text-slate-200 hover:bg-white/5 transition"
            >
              Volver a admin
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
