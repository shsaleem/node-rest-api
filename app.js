import express from "express";
const app = express();
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import actorRoutes from "./api/routes/actors.js";
import movieRoutes from "./api/routes/movies.js";
import userRoutes from "./api/routes/users.js";

dotenv.config();

mongoose.connect(
  "mongodb+srv://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD +
    "@movie-rest-api.3pzxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "hbs");
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutDir: __dirname + "views/layouts",
  })
);

// app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("main");
});

app.use("/actors", actorRoutes);
app.use("/movies", movieRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
