import { Router } from "express";
import { createReportRouter } from "./create";
import { getReportRouter } from "./get";

const router = Router();

router.use(createReportRouter);
router.use(getReportRouter);

export { router as indexReportRouter };
