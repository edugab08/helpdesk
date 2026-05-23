// ─── Configuração central da API ──────────────────────────────────────────────
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ─── Tipos alinhados com o back-end (Prisma schema) ──────────────────────────
export type UserRole = 'USER' | 'ADMIN';
export type TicketStatus = 'ABERTO' | 'EM_ANDAMENTO' | 'RESOLVIDO' | 'FECHADO';
export type TicketPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  userId: string;
  assignedTo?: string;
  categoryId?: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  assigned?: Pick<User, 'id' | 'name'>;
  category?: { id: string; name: string };
  _count?: { comments: number };
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<User, 'id' | 'name'>;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

export type TicketStats = {
  total: number;
  aberto: number;
  emAndamento: number;
  resolvido: number;
};

// ─── Cliente HTTP com injeção automática de JWT ───────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexsupport_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expirado ou inválido → limpa sessão
    localStorage.removeItem('nexsupport_token');
    localStorage.removeItem('nexsupport_user');
    window.location.href = '/login';
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.message || `Erro ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

// ─── Tickets ──────────────────────────────────────────────────────────────────
export const ticketsApi = {
  listar: (filtros?: Partial<Record<string, string>>) => {
    const params = filtros ? '?' + new URLSearchParams(filtros).toString() : '';
    return request<Ticket[]>(`/tickets${params}`);
  },

  buscar: (id: string) => request<Ticket>(`/tickets/${id}`),

  criar: (data: { title: string; description: string; priority?: TicketPriority; categoryId?: string }) =>
    request<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(data) }),

  atualizar: (id: string, data: Partial<Ticket>) =>
    request<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  remover: (id: string) =>
    request<{ message: string }>(`/tickets/${id}`, { method: 'DELETE' }),

  stats: () => request<TicketStats>('/tickets/stats'),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  listar: () => request<User[]>('/users'),
  buscar: (id: string) => request<User>(`/users/${id}`),
  atualizar: (id: string, data: Partial<User>) =>
    request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remover: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
};
