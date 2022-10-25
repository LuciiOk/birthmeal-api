import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Company } from 'src/companies/schemas/companies.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthdate: Date;

  // many-to-many relationship favorites with Companies Schema
  @Prop({ type: [{ type: Types.ObjectId, ref: Company.name }] })
  favorites: Company[];
}

export const UserSchema = SchemaFactory.createForClass(User);
