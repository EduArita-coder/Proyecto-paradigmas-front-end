import { useEffect, useState } from 'react';
import { getTransacciones } from '../../services/apiService';
import type { Transaction } from '../../services/apiService';

export default function HistorialPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransacciones();
      setTransactions(data);
    } catch (err) {
      console.error('Error al obtener historial:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Historial de Transacciones
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Consulta tus compras anteriores y su estado de procesamiento.
        </p>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 animate-pulse">
            Cargando transacciones...
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 flex flex-col items-center justify-center text-slate-500">
            <span className="text-5xl mb-4"></span>
            <p className="text-slate-300">Aún no tienes transacciones registradas.</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/5 text-xs uppercase text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-4 px-6">ID Transacción</th>
                    <th className="py-4 px-6">Producto</th>
                    <th className="py-4 px-6">Monto</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {tx.externalTransactionId || tx.id}
                      </td>
                      <td className="py-4 px-6 font-medium text-white">
                        {tx.productName || 'Servidor GameHosting'}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            tx.status?.toLowerCase() === 'completed' || tx.status?.toLowerCase() === 'aprobado'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
