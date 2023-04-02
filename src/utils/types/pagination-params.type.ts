import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

class PaginationParams {
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @Min(0)
  @IsOptional()
  limit?: number;
}

export default PaginationParams;
