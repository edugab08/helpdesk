import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'])
  @IsOptional()
  status?: 'ABERTO' | 'EM_ANDAMENTO' | 'RESOLVIDO' | 'FECHADO';

  @IsEnum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'])
  @IsOptional()
  priority?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
