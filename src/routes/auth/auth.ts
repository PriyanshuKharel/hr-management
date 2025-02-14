import { RequestHandler, Router } from "express";
import { authenticateUserHandler } from "../../controllers/auth/auth";

const router = Router();

router.post("/oauth/callback", authenticateUserHandler as RequestHandler);

export { router as authenticateUserRouter };
