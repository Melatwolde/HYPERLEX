import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as NodeCache from 'node-cache';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private cache: NodeCache;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes
  }

  async getChatCompletion(prompt: string): Promise<string> {
    const cachedResponse = this.cache.get<string>(prompt);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a legal contract analysis assistant. Identify key terms, risks, and simplify legal jargon.' },
          { role: 'user', content: prompt },
        ],
        store: true,
      });

      const content = completion.choices[0].message.content;
      if (content === null) {
        throw new Error('Completion content is null');
      }

      this.cache.set(prompt, content);
      return content;
    } catch (error) {
      if (error.code === 'insufficient_quota') {
        throw new BadRequestException('You have exceeded your current quota. Please check your plan and billing details.');
      }
      throw new InternalServerErrorException('An error occurred while processing your request.');
    }
  }
}