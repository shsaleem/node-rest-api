import mongoose from "mongoose";

const { Schema, model } = mongoose;

const actorSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  profileImage: { type: String, required: true },
});

export default model("Actor", actorSchema);
