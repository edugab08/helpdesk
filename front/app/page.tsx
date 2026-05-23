'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import PainelEstatisticas from './components/ui/PainelEstatisticas';
import { ticketsApi, Ticket, TicketStatus } from './lib/api';
import { useAuth } from './contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, logout, carregando: authCarregando } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<TicketStatus | 'TODOS'>('ABERTO');

  useEffect(() => {
    if (authCarregando) return;
    carregarTickets();
  }, [authCarregando, filtroStatus]);

  async function carregarTickets() {
    try {
      setCarregando(true);
      const filtros = filtroStatus !== 'TODOS' ? { status: filtroStatus } : {};
      const dados = await ticketsApi.listar(filtros);
      setTickets(dados);
    } catch (err: any) {
      toast.error('Erro ao carregar chamados: ' + (err.message || 'Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }

  if (authCarregando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      <Sidebar
        tickets={tickets}
        carregando={carregando}
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        user={user}
        onLogout={logout}
      />
      <PainelEstatisticas tickets={tickets} />
    </div>
  );
}
