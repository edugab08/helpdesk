'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { UserPlus, Loader2, ShieldCheck } from 'lucide-react';
import { authApi } from '../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await authApi.register(name, email, password);
      toast.success('Conta criada com sucesso! Faça login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 mb-4">
            <ShieldCheck size={36} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">NexSupport</h1>
          <p className="text-slate-400 mt-2">Crie sua conta para começar</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={carregando}
                placeholder="João da Silva"
                className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={carregando}
                placeholder="seu@email.com"
                className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={carregando}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold p-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-blue-500/50 mt-2"
            >
              {carregando ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
