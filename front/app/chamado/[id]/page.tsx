'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ticketsApi, Ticket } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import ChatHeader from '../../components/ui/ChatHeader';
import ChatMessages from '../../components/ui/ChatMessages';
import ChatInput from '../../components/ui/ChatInput';
import { Loader2 } from 'lucide-react';

export type Mensagem = {
  id: string;
  texto: string;
  remetente: 'usuario' | 'suporte';
  hora: string;
};

export default function PaginaChamado() {
  const { user, isAdmin } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await ticketsApi.buscar(id);
        setTicket(dados);

        // Inicializa chat com a descrição do ticket
        setMensagens([
          {
            id: '0',
            texto: dados.description,
            remetente: 'usuario',
            hora: new Date(dados.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: '1',
            texto: 'Olá! Sou do suporte. Como posso te ajudar com este problema?',
            remetente: 'suporte',
            hora: 'Agora',
          },
        ]);
      } catch {
        toast.error('Chamado não encontrado.');
        router.push('/');
      }
    }

    if (id) carregarDados();
  }, [id, router]);

  async function resolver() {
    if (!ticket) return;
    setSalvando(true);
    try {
      await ticketsApi.atualizar(id, { status: 'RESOLVIDO' });
      setTicket((prev) => prev ? { ...prev, status: 'RESOLVIDO' } : prev);
      toast.success('Chamado marcado como resolvido!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao resolver chamado.');
      setSalvando(false);
    }
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    const msg: Mensagem = {
      id: Date.now().toString(),
      texto: novaMensagem,
      remetente: isAdmin ? 'suporte' : 'usuario',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMensagens((prev) => [...prev, msg]);
    setNovaMensagem('');
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <span>Carregando atendimento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-8 font-sans text-slate-200">
      <div className="w-full max-w-4xl flex flex-col h-[90vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <ChatHeader
          ticket={ticket}
          onResolver={resolver}
          salvando={salvando}
          isAdmin={isAdmin}
        />
        <ChatMessages mensagens={mensagens} />
        <ChatInput
          novaMensagem={novaMensagem}
          setNovaMensagem={setNovaMensagem}
          onEnviar={enviar}
          status={ticket.status}
        />
      </div>
    </div>
  );
}
