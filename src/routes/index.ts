import { Router } from "express";
import { indexReportRouter } from "./report";
import { indexLeaveRequestRouter } from "./leave-request";

const router = Router();

router.use("/reports", indexReportRouter);
router.use("/leaves", indexLeaveRequestRouter);

export default router;
