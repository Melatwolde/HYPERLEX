import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import * as pdfParse from 'pdf-parse';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContract(
    @UploadedFile() file: Express.Multer.File,
    @Body() createContractDto: CreateContractDto
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let contractText = '';

    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      contractText = pdfData.text;
    } else {
      contractText = file.buffer.toString('utf-8');
    }

    return this.contractsService.uploadContract(file, contractText, createContractDto);
  }

  @Post('analyze')
  async analyzeContract(@Body() analyzeContractDto: CreateContractDto) {
    if (!analyzeContractDto.content) {
      throw new BadRequestException('No contract content provided.');
    }
    
    return this.contractsService.analyzeContract(analyzeContractDto.content);
  }
}
