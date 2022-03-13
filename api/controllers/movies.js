import mongoose from "mongoose";
import { Parser } from "json2csv";
import fs from "fs";

import Movie from "../models/movie.js";

// Fetch all movies
const getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find()
      .select("_id name genre actors business rating reviews moviePoster")
      .populate("actors", "name");

    res.status(200).json({
      totalMovies: movies.length,
      movies,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//Creat movie
const createMovie = async (req, res, next) => {
  const movie = await new Movie({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    genre: req.body.genre,
    actors: req.body.actors,
    business: req.body.business,
    rating: req.body.rating,
    reviews: req.body.reviews,
    moviePoster: req.file.path,
  });

  try {
    const result = await movie.save();
    res.status(201).json({
      message: "Movie created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Fetch single movie
const getSingleMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId)
      .select("_id name genre actors business rating reviews moviePoster")
      .populate("actors", "name");

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ message: "Movie Not Found." });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Fetch movies by genre
const movieByGenre = async (req, res, next) => {
  const genre = req.params.keyword;

  try {
    const movies = await Movie.find({ genre })
      .select("_id name genre actors business rating reviews moviePoster")
      .populate("actors", "name");

    if (movies.length >= 1) {
      res.status(200).json(movies);
    } else {
      res.status(404).json({ message: "No Movie Found." });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Update a movie
const updateMovie = async (req, res, next) => {
  const { movieId } = req.params;

  const updateMovie = {};
  for (const ops of req.body) {
    updateMovie[ops.propName] = ops.value;
  }

  try {
    const updatedMovie = await Movie.updateOne(
      { _id: movieId },
      { $set: updateMovie }
    );
    res.status(200).json({
      message: "Movie Updated.",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Business done by movies of a specific actor
const business = async (req, res, next) => {
  const { actorId } = req.params;
  try {
    const movies = await Movie.find({ actors: [{ _id: actorId }] }).populate(
      "actors",
      "name"
    );
    const response = {
      count: movies.length,
      totalBusiness: movies.reduce((total, movie) => {
        return total + movie.business;
      }, 0),
      moviesByActor: movies.map((movie) => {
        const { name, actors, business } = movie;
        return {
          name,
          actors,
          business,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Delete a movie
const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const deletedMovie = await Movie.deleteOne({ _id: movieId });
    res.status(200).json({
      message: "Movie Deleted.",
    });
  } catch (error) {
    res.status(500).json({ error: err });
  }
};

//Generate movie csv file
const generateCSV = async (req, res, next) => {
  try {
    const movies = await Movie.find()
      .select("_id name genre actors business rating reviews moviePoster")
      .populate("actors", "name");

    const fields = ["_id", "name", "genre", "business", "rating", "reviews"];
    const opts = { fields };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(movies);
      fs.writeFile(`${new Date().getTime()} moviesData.csv`, csv, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } catch (err) {
      console.error(err);
    }
    res.status(200).json({
      message: "CSV created Successfuly.",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

export {
  getAllMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  movieByGenre,
  business,
  deleteMovie,
  generateCSV,
};
