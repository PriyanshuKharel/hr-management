import { Router } from "express";
import { createLeaveRequestRouter } from "./create";

const router = Router();

router.use(createLeaveRequestRouter);

export { router as indexLeaveRequestRouter };
