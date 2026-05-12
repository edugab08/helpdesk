import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTicketDto, userId: string) {
    return this.prisma.ticket.create({
      data: { ...dto, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  async findAll(filters: FilterTicketDto) {
    const where: any = {};

    if (filters.status)     where.status = filters.status;
    if (filters.priority)   where.priority = filters.priority;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters.userId)     where.userId = filters.userId;

    return this.prisma.ticket.findMany({
      where,
      include: {
        user:     { select: { id: true, name: true } },
        assigned: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        _count:   { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        user:     { select: { id: true, name: true, email: true } },
        assigned: { select: { id: true, name: true } },
        category: true,
        comments: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
        attachments: {
          include: { uploader: { select: { id: true, name: true } } },
        },
        ticketHistory: {
          include: { changer: { select: { id: true, name: true } } },
          orderBy: { changedAt: 'desc' },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Chamado não encontrado');
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto, userId: string, userRole: string) {
    const ticket = await this.findOne(id);

    // Usuário comum só pode editar os próprios chamados
    if (userRole !== 'ADMIN' && ticket.userId !== userId) {
      throw new ForbiddenException('Sem permissão para editar este chamado');
    }

    // Registra histórico de mudanças automaticamente
    const historyEntries: any[] = [];
    const trackFields = ['status', 'priority', 'assignedTo', 'categoryId'];

    for (const field of trackFields) {
      if (dto[field] !== undefined && dto[field] !== ticket[field]) {
        historyEntries.push({
          ticketId: id,
          changedBy: userId,
          fieldChanged: field,
          oldValue: ticket[field] ?? null,
          newValue: dto[field],
        });
      }
    }

    // Marca resolvedAt quando status muda para RESOLVIDO
    const data: any = { ...dto };
    if (dto.status === 'RESOLVIDO' && ticket.status !== 'RESOLVIDO') {
      data.resolvedAt = new Date();
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.ticket.update({ where: { id }, data }),
      ...historyEntries.map(entry => this.prisma.ticketHistory.create({ data: entry })),
    ]);

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.ticket.delete({ where: { id } });
    return { message: 'Chamado removido com sucesso' };
  }

  async getStats() {
    const [total, aberto, emAndamento, resolvido] = await Promise.all([
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: 'ABERTO' } }),
      this.prisma.ticket.count({ where: { status: 'EM_ANDAMENTO' } }),
      this.prisma.ticket.count({ where: { status: 'RESOLVIDO' } }),
    ]);

    return { total, aberto, emAndamento, resolvido };
  }
}
