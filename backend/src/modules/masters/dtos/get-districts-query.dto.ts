import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetDistrictsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stateId!: number;
}
