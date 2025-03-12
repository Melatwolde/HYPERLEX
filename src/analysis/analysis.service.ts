import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract } from '../schemas/contract.schema';
import { AnalyzeContractDto } from './dto/analyze-contract.dto';
import { OpenAI } from 'openai';

@Injectable()
export class AnalysisService {
  private openai: OpenAI;

  constructor(@InjectModel(Contract.name) private contractModel: Model<Contract>) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });
  }

  async analyzeContract(file: Express.Multer.File, analyzeContractDto: AnalyzeContractDto): Promise<any> {
    if (!analyzeContractDto.content) {
      throw new BadRequestException('Contract content is required.');
    }

    const { content } = analyzeContractDto;

    const insights = await this.extractInsights(content);
    const analyzedContract = new this.contractModel({
      content,
      insights,
      analyzedAt: new Date(),
    });

    await analyzedContract.save();
    return insights;
  }

  private async extractInsights(content: string): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4', // Adjust based on available models
      messages: [
        { role: 'system', content: 'You are a legal assistant analyzing contracts for risks and readability.' },
        { role: 'user', content: `Analyze this contract and extract key risks and readability insights:\n\n${content}` },
      ],
      max_tokens: 500,
    });

    const insights = response.choices[0]?.message?.content || 'No insights found';

    return {
      insights,
      risks: this.detectRisks(insights),
      readabilityScore: this.calculateReadabilityScore(content),
    };
  }

  private detectRisks(insights: string): string[] {
    const detectedRisks: string[] = [];
    const riskKeywords = ['penalty', 'liability', 'termination', 'lawsuit', 'arbitration', 'non-compete'];

    riskKeywords.forEach(keyword => {
      if (insights.toLowerCase().includes(keyword)) {
        detectedRisks.push(`Potential risk: "${keyword}" found in the contract.`);
      }
    });

    return detectedRisks.length > 0 ? detectedRisks : ['No major risks detected.'];
  }

  private calculateReadabilityScore(text: string): number {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]/).length;
    const syllables = text.replace(/[^aeiouy]/g, '').length; // Approximate syllable count

    // Flesch-Kincaid readability formula
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.round(score * 100) / 100;
  }
}
