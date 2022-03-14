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

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllActors);

router.get("/dummy-actors", getDummyActors);

router.post("/", upload.single("profileImage"), createActor);

router.get("/:actorId", getSingleActor);

router.patch("/:actorId", updateActor);

router.delete("/:actorId", deleteActor);

export default router;
