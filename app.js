import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from "express";
const app = express();
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { auth } from "express-openid-connect";
const { requiresAuth } = require("express-openid-connect");

dotenv.config();

import actorRoutes from "./api/routes/actors.js";
import movieRoutes from "./api/routes/movies.js";
import userRoutes from "./api/routes/users.js";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

mongoose.connect(
  "mongodb+srv://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD +
    "@movie-rest-api.3pzxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
