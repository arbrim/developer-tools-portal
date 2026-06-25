import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LinkDocument = HydratedDocument<ToolLink>;

@Schema({ timestamps: true })
export class ToolLink {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true })
  icon?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const LinkSchema = SchemaFactory.createForClass(ToolLink);
