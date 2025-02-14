import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../../middlewares/requestHandler";
import { createReportHandler } from "../../controllers/report/create";

const router = Router();

router.post(
  "/",
  validate([
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters long"),
  ]),
  createReportHandler
);

export { router as createReportRouter };
