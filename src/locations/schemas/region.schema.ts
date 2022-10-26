import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class Commune extends Document {
  @Prop({ required: true, type: String })
  id: string;
  @Prop({ required: true, type: String })
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
