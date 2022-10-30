import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  icon: string;

  @Prop({ required: false })
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
