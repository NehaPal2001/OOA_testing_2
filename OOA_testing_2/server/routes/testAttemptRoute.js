import express from "express";
import {
  createTestAttempt,
  uploadMarks,
  getTestAttemptById,
  getTestAttempt,
} from "../controllers/testAttemptController.js";

const router = express.Router();

router.post("/create-attempt", createTestAttempt);
router.get("/all-attempt", getTestAttempt);
router.get("/get-attempt/:id", getTestAttemptById);
router.put("/upload-marks", uploadMarks);

export default router;
