import mongoose from "mongoose";
import fetch from "cross-fetch";
import download from "image-downloader";

import Actor from "../models/actor.js";
import bucket from "../../firebase/firebase.js";
<<<<<<< HEAD
=======
import pagination from "../utils/pagination.js";
>>>>>>> 362290860d7c9faaeb0754c9bfe21a74275131ae

const url = "https://dummyapi.io/data/v1/user?limit=10";

const options = {
  method: "GET",
  headers: {
    "app-id": "6226f2ba358f953f7863f771",
  },
};

// Fetch actors from dummy api and save to database
const fetchActors = () => {
  fetch(url, options)
    .then((response) => response.json())
    .then((docs) => {
      const { data } = docs;
      data.map((doc) => {
        const { firstName, lastName, title, picture } = doc;

        const options = {
          url: `${picture}`,
          dest: "../../actorImages",
        };

        download
          .image(options)
          .then(({ filename }) => {
            console.log("Saved to", filename);
          })
          .catch((err) => console.error(err));

        const actor = new Actor({
          _id: new mongoose.Types.ObjectId(),
          name: `${firstName} ${lastName}`,
          age: Math.floor(Math.random() * (45 - 20 + 1)) + 20,
          gender: `${title === "mr" ? "male" : "female"}`,
          profileImage: picture,
        });

        actor
          .save()
          .then((result) => {
            console.log("Actor added to the database");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => console.log(err));
};

// Get Dummy Actors
const getDummyActors = async (req, res, next) => {
  let { limit, skip } = pagination(req.query);
  fetchActors();
  try {
    const actors = await Actor.find()
      .skip(skip)
      .limit(limit)
      .select("_id name age gender profileImage");
    res.status(200).json({
      totalActors: actors.length,
      actors,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Fetch all actors
const getAllActors = async (req, res, next) => {
  let { limit, skip } = pagination(req.query);
  try {
    const actors = await Actor.find()
      .skip(skip)
      .limit(limit)
      .select("_id name age gender profileImage")
      .lean();
    // res.status(200).json({
    //   totalActors: actors.length,
    //   actors,
    // });
    res.render("actors", { actors });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Create actor
const createActor = async (req, res, next) => {
  const actor = await new Actor({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    profileImage: req.file.path,
  });

  try {
    const createdActor = await actor.save();
    res.status(201).json({
      message: "Actor created successfully",
    });

    await bucket
      .upload(createdActor.profileImage, {
        metadata: {
          contentType: req.file.mimetype,
        },
      })
      .then(() => console.log("Uploaded"))
      .catch((err) => console.log(err));
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Fetch single actor
const getSingleActor = async (req, res, next) => {
  const { actorId } = req.params;

  try {
    const actor = await Actor.findById(actorId)
      .select("_id name age gender profileImage")
      .lean();
    if (actor) {
      // res.status(200).json(actor);
      res.render("singleActors", { actor });
    } else {
      res.status(404).json({ message: "Actor Not Found." });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Update actor
const updateActor = async (req, res, next) => {
  const { actorId } = req.params;

  const updateActor = {};
  for (const ops of req.body) {
    updateActor[ops.propName] = ops.value;
  }

  try {
    const updatedActor = await Actor.updateOne(
      { _id: actorId },
      { $set: updateActor }
    );
    res.status(200).json({
      message: "Actor updated",
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Delete actor
const deleteActor = async (req, res, next) => {
  const { actorId } = req.params;

  try {
    const deletedActor = await Actor.deleteOne({ _id: actorId });
    res.status(200).json({
      message: "Actor deleted",
    });
  } catch (error) {
    res.status(500).json({ error: err });
  }
};

export {
  getAllActors,
  getDummyActors,
  getSingleActor,
  createActor,
  updateActor,
  deleteActor,
};
