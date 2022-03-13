import mongoose from "mongoose";

const { Schema, model } = mongoose;

const movieSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, unique: true },
  genre: { type: String, required: true },
  actors: [{ type: Schema.Types.ObjectId, ref: "Actor", required: true }],
  business: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviews: [{ type: String }],
  moviePoster: { type: String, required: true },
});

export default model("Movie", movieSchema);
