import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Server {
  id: string;
  name: string;
  game: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  ip: string;
  port: number;
  cpuUsage: number;
  ramUsage: string;
  players: string;
  logs: string[];
}

export default function MyServersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [servers, setServers] = useState<Server[]>([
    {
      id: 'srv-1',
      name: 'Servidor Survival Minecraft VIP',
      game: 'Minecraft',
      status: 'online',
      ip: 'mc.gamehosting.net',
      port: 25565,
      cpuUsage: 18,
      ramUsage: '3.4 GB / 8 GB',
      players: '12 / 32',
      logs: [
        '[18:00:01 INFO]: Server started on 0.0.0.0:25565',
        '[18:02:15 INFO]: Player "Steve" joined the game',
        '[18:05:42 INFO]: Player "Alex" joined the game',
        '[18:10:00 INFO]: Saving world data...',
      ],
    },
    {
      id: 'srv-2',
      name: 'Servidor Rust Clan War 2x',
      game: 'Rust',
      status: 'offline',
      ip: 'rust.gamehosting.net',
      port: 28015,
      cpuUsage: 0,
      ramUsage: '0 GB / 16 GB',
      players: '0 / 100',
      logs: [
        '[17:30:00 INFO]: Server process stopped safely.',
      ],
    },
    {
      id: 'srv-3',
      name: 'Counter-Strike 2 competitive',
      game: 'CS2',
      status: 'online',
      ip: 'cs2.gamehosting.net',
      port: 27015,
      cpuUsage: 25,
      ramUsage: '2.1 GB / 6 GB',
      players: '10 / 10',
      logs: [
        '[18:00:10 INFO]: Match map loaded: de_dust2',
        '[18:01:00 INFO]: Warmup started.',
      ],
    },
  ]);

  const [activeConsoleServer, setActiveConsoleServer] = useState<Server | null>(null);
  const [consoleInput, setConsoleInput] = useState('');

  const handleAction = (serverId: string, action: 'start' | 'stop' | 'restart') => {
    setServers((prev) =>
      prev.map((srv) => {
        if (srv.id !== serverId) return srv;

        let newStatus = srv.status;
        let newLogs = [...srv.logs];

        if (action === 'start') {
          newStatus = 'online';
          newLogs.push(`[${new Date().toLocaleTimeString()} SYSTEM]: Servidor iniciado por el usuario ${user?.userName || ''}`);
          showToast(`Servidor "${srv.name}" iniciado con éxito`, 'success');
        } else if (action === 'stop') {
          newStatus = 'offline';
          newLogs.push(`[${new Date().toLocaleTimeString()} SYSTEM]: Servidor detenido.`);
          showToast(`Servidor "${srv.name}" detenido`, 'warning');
        } else if (action === 'restart') {
          newStatus = 'online';
          newLogs.push(`[${new Date().toLocaleTimeString()} SYSTEM]: Reiniciando servidor...`);
          newLogs.push(`[${new Date().toLocaleTimeString()} SYSTEM]: Servidor reiniciado correctamente.`);
          showToast(`Servidor "${srv.name}" reiniciado`, 'info');
        }

        const updated = {
          ...srv,
          status: newStatus,
          cpuUsage: newStatus === 'online' ? Math.floor(Math.random() * 30) + 15 : 0,
          logs: newLogs,
        };

        if (activeConsoleServer?.id === serverId) {
          setActiveConsoleServer(updated);
        }

        return updated;
      })
    );
  };

  const handleSendConsoleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim() || !activeConsoleServer) return;

    const cmd = consoleInput.trim();
    const newLog = `> ${cmd}`;
    let responseLog = `[${new Date().toLocaleTimeString()} CONSOLE]: Comando ejecutado con éxito: "${cmd}"`;

    if (cmd.toLowerCase() === 'stop') {
      handleAction(activeConsoleServer.id, 'stop');
      setConsoleInput('');
      return;
    }

    const updatedLogs = [...activeConsoleServer.logs, newLog, responseLog];

    setServers((prev) =>
      prev.map((srv) =>
        srv.id === activeConsoleServer.id ? { ...srv, logs: updatedLogs } : srv
      )
    );

    setActiveConsoleServer({
      ...activeConsoleServer,
      logs: updatedLogs,
    });

    setConsoleInput('');
  };

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            🎮 Mis Servidores Activos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestiona tus servidores contratados, monitorea el estado en vivo y accede a la consola de comandos.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-sm flex items-center gap-2">
          <span>Servidores Activos:</span>
          <span className="font-bold text-cyan-400">
            {servers.filter((s) => s.status === 'online').length} / {servers.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server) => (
          <div
            key={server.id}
            className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                  {server.game}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {server.status === 'online' ? (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      Offline
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {server.name}
              </h3>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 mb-4 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">IP & Puerto:</span>
                  <span className="font-mono text-cyan-300 font-semibold select-all">
                    {server.ip}:{server.port}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Jugadores:</span>
                  <span className="font-medium">{server.players}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">RAM:</span>
                  <span className="font-medium">{server.ramUsage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Uso CPU:</span>
                  <span className="font-medium">{server.cpuUsage}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={server.status === 'online'}
                  onClick={() => handleAction(server.id, 'start')}
                  className="py-2 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  ▶ Iniciar
                </button>

                <button
                  disabled={server.status === 'offline'}
                  onClick={() => handleAction(server.id, 'stop')}
                  className="py-2 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  ⏹ Detener
                </button>

                <button
                  disabled={server.status === 'offline'}
                  onClick={() => handleAction(server.id, 'restart')}
                  className="py-2 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  🔄 Reiniciar
                </button>
              </div>

              <button
                onClick={() => setActiveConsoleServer(server)}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                💻 Abrir Consola Interactiva
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Console Modal */}
      {activeConsoleServer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
            {/* Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Consola en Vivo - {activeConsoleServer.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeConsoleServer.ip}:{activeConsoleServer.port}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveConsoleServer(null)}
                className="text-slate-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Log View */}
            <div className="flex-1 bg-black/90 p-4 font-mono text-xs text-green-400 overflow-y-auto space-y-1">
              {activeConsoleServer.logs.map((log, index) => (
                <div key={index} className={log.startsWith('>') ? 'text-cyan-300 font-bold' : ''}>
                  {log}
                </div>
              ))}
            </div>

            {/* Console Input */}
            <form onSubmit={handleSendConsoleCommand} className="p-3 bg-slate-950 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Escribe un comando de consola (ej. op player, say hola)..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
