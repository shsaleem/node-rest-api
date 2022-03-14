import express from "express";
const router = express.Router();
import multer from "multer";

import {
  getAllMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  movieByGenre,
  business,
  deleteMovie,
  generateCSV,
} from "../controllers/movies.js";

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllMovies);

router.post("/", upload.single("moviePoster"), createMovie);

router.get("/:movieId", getSingleMovie);

router.get("/genre/:keyword", movieByGenre);

router.patch("/:movieId", updateMovie);

router.get("/business/:actorId", business);

router.delete("/:movieId", deleteMovie);

router.get("/csv/generate-csv", generateCSV);

export default router;
