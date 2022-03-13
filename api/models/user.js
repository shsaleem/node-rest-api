import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String },
  phone: { type: Number },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  resetToken: {
    data: String,
    default: "",
  },
});

export default model("User", userSchema);
