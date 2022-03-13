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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", getAllMovies);

router.post("/", upload.single("moviePoster"), createMovie);

router.get("/:movieId", getSingleMovie);

router.get("/genre/:keyword", movieByGenre);

router.patch("/:movieId", updateMovie);

router.get("/business/:actorId", business);

router.delete("/:movieId", deleteMovie);

router.get("/csv/generate-csv", generateCSV);

export default router;
