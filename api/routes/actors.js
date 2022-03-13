import express from "express";
const router = express.Router();
import multer from "multer";

import {
  getAllActors,
  getDummyActors,
  createActor,
  getSingleActor,
  updateActor,
  deleteActor,
} from "../controllers/actors.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", getAllActors);

router.get("/dummy-actors", getDummyActors);

router.post("/", upload.single("profileImage"), createActor);

router.get("/:actorId", getSingleActor);

router.patch("/:actorId", updateActor);

router.delete("/:actorId", deleteActor);

export default router;
