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
