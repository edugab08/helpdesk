import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class FilterTicketDto {
  @IsEnum(['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'])
  @IsOptional()
  status?: string;

  @IsEnum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'])
  @IsOptional()
  priority?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
