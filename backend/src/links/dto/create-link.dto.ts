import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  category: string;

  @IsUrl({ require_tld: false })
  url: string;

  @IsString()
  @MinLength(4)
  @MaxLength(240)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
