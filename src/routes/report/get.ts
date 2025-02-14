import { Router } from "express";
import { getReportHandler } from "../../controllers/report/get";

const router = Router();

router.get("/", getReportHandler);

export { router as getReportRouter };
