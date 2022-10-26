import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export class Commune extends Document {
  id: string;
  name: string;
}

@Schema()
export class Region extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [
      {
        name: String,
        id: String,
      },
    ],
  })
  communes: Commune[];
}

export const RegionSchema = SchemaFactory.createForClass(Region);
