import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../../middlewares/requestHandler";
import { createLeaveRequestHandler } from "../../controllers/leave-request/create";

const router = Router();

router.post(
  "/",

  createLeaveRequestHandler
);

export { router as createLeaveRequestRouter };
