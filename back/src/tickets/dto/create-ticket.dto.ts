import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'])
  @IsOptional()
  priority?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}

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
