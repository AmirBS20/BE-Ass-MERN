import { InferSchemaType, model, Schema } from "mongoose";

const topicSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true });

type Topic = InferSchemaType<typeof topicSchema>;

export default model<Topic>("Topic", topicSchema);