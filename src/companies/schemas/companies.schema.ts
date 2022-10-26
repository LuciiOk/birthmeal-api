import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Location } from '../../locations/schemas/locations.schema';

@Schema()
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number })
  rating: number;

  @Prop({ required: true })
  webUrl: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
