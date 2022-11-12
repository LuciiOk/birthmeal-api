import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Valoration extends Document {
  @Prop({ required: true, min: 1, max: 5 })
  stars: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  })
  company: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: false, maxlength: 255 })
  comment: string;
}

export const ValorationSchema = SchemaFactory.createForClass(Valoration);
