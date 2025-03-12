import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract, ContractSchema } from '../schemas/contract.schema';
import { OpenAIService } from '../openAI/openai.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService, OpenAIService],
})
export class ContractsModule {}