import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContractDto {
    
    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsString()
    @IsOptional()
    readonly title?: string;

    @IsString()
    @IsOptional()
    readonly author?: string;

    @IsString()
    @IsOptional()
    readonly date?: string;
}