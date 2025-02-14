import { Response, Request, NextFunction } from "express";
import { Report } from "../../models/report";

const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Report.find().sort({ createdAt: -1 });
    console.log("🚀 ~ getReport ~ report:", report);

    res.status(200).json({
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export { getReport as getReportHandler };
