import { Response, Request, NextFunction } from "express";
import { Report } from "../../models/report";
import { sendAnonymousReport } from "../../services/emailService";
import { sendToPrivateChannel } from "../../services/slackService";

const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;

    const report = await Report.build({ message }).save();

    await Promise.all([
      sendAnonymousReport(message),
      sendToPrivateChannel(message),
    ]);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export { createReport as createReportHandler };
