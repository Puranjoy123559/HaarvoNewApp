export class MemberRangeDto {
  id!: number;
  label!: string;
  code!: string;
  minValue!: number;
  // null means "and above" (e.g. 500+)
  maxValue!: number | null;
}
