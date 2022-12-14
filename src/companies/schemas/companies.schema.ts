import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { Category } from './categories.schema';

@Schema()
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  benefits: string[];

  @Prop({ required: false, default: [0, 0, 0, 0, 0], type: [Number] })
  rating: number[];

  @Prop({ required: true })
  webUrl: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
  })
  category: Category;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
