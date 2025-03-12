import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractSchema } from '../schemas/contract.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/backend', {
    }),
    MongooseModule.forFeature([{ name: 'Contract', schema: ContractSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}