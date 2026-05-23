'use client';

import { User, Headset } from 'lucide-react';

export type Mensagem = {
  id: string;
  texto: string;
  remetente: 'usuario' | 'suporte';
  hora: string;
};

export default function ChatMessages({ mensagens }: { mensagens: Mensagem[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-6">
      {mensagens.map((msg) => {
        const isSuporte = msg.remetente === 'suporte';
        return (
          <div key={msg.id} className={`flex gap-3 ${isSuporte ? 'justify-end' : 'justify-start'}`}>
            {!isSuporte && (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-slate-700">
                <User size={16} />
              </div>
            )}
            <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${isSuporte ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
              <p className="text-sm leading-relaxed">{msg.texto}</p>
              <span className={`text-[10px] mt-2 block text-right ${isSuporte ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.hora}
              </span>
            </div>
            {isSuporte && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Headset size={16} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
