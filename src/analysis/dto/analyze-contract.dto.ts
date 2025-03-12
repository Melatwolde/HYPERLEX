export class AnalyzeContractDto {
    readonly content: string;
    readonly insights: string;
    readonly risks: string[];
    readonly readabilityScore: number;
}