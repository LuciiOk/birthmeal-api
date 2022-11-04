import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Company } from 'src/companies/schemas/companies.schema';

@Schema({ _id: false })
export class GeoLocation extends Document {
  @Prop({ default: 'Point' })
  type?: string;

  @Prop({ required: true, index: '2dsphere' })
  coordinates: number[];
}

@Schema()
export class Location extends Document {
  @Prop({ required: true, unique: true })
  place_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  commune: string;

  @Prop({ required: true, type: GeoLocation })
  geometry: GeoLocation;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: (Company?.name as string) || 'Company',
  })
  company: Company;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);
