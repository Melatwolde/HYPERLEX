import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from '../schemas/contract.schema';
import { CreateContractDto } from './dto/create-contract.dto';
import * as pdf from 'pdf-parse';
import { Express } from 'express';
import { OpenAIService } from '../openAI/openai.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    private openAIService: OpenAIService,
  ) {}

  async uploadContract(file: Express.Multer.File, contractText:string, createContractDto: CreateContractDto): Promise<Contract> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileContent = await this.parseFile(file);
    const contractData = {
      ...createContractDto,
      content: fileContent,
      fileName: file.originalname,
      uploadedAt: new Date(),
    };

    const createdContract = new this.contractModel(contractData);
    return createdContract.save();
  }

  private async parseFile(file: Express.Multer.File): Promise<string> {
    if (file.mimetype === 'application/pdf') {
      const data = await pdf(file.buffer);
      return data.text;
    }

    throw new BadRequestException('Unsupported file type');
  }

  async analyzeContract(content: string): Promise<any> {
    if (!content) {
      throw new BadRequestException('No contract content provided.');
    }

    const truncatedContent = content.slice(0, 4000); // Avoid token limit issues

    const prompt = `
      You are a legal contract analyzer AI. Analyze the following contract and provide a JSON response with:
      - "key_clauses": Important clauses found.
      - "potential_risks": Any risks or concerns.
      - "readability_score": A score from 1-10.
      - "simplified_explanations": A simpler version of difficult sections.

      Contract:
      """ 
      ${truncatedContent}
      """
    `;

    try {
      const aiResponse = await this.openAIService.getChatCompletion(prompt);
      return aiResponse;
    } catch (error) {
      console.error('Contract Analysis Error:', error);
      throw new InternalServerErrorException('An error occurred while analyzing the contract.');
    }
  }

  async findAll(): Promise<Contract[]> {
    return this.contractModel.find().exec();
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractModel.findById(id).exec();
    if (!contract) {
      throw new BadRequestException('Contract not found');
    }
    return contract;
  }
}
