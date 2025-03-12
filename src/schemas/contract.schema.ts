import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Contract {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  fileName: string;

  @Prop()
  uploadedAt: Date;
}

export type ContractDocument = Contract & Document;
export const ContractSchema = SchemaFactory.createForClass(Contract);