import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MoongoseSchema } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: MoongoseSchema.Types.ObjectId, ref: 'Category' })
    category: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: MoongoseSchema.Types.ObjectId, ref: 'User' })
    createdBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);