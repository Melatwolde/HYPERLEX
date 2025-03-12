import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalyzeContractDto } from './dto/analyze-contract.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeContract(@UploadedFile() file: Express.Multer.File, @Body() analyzeContractDto: AnalyzeContractDto) {
    return this.analysisService.analyzeContract(file, analyzeContractDto);
  }
}