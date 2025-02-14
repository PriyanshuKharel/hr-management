import { Response, Request, NextFunction } from "express";
import { Leave } from "../../models/leave";
import {
  sendDailyLeaveReminder,
  sendInitialLeaveEmail,
} from "../../services/emailService";
import { sendToPublicChannel } from "../../services/slackService";
import logger from "../../utils/logger";
import cron from "node-cron";

const createLeaveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, message, leaveDate } = req.body;

    const leaveDates = Array.isArray(leaveDate) ? leaveDate : [leaveDate];
    const parsedDates = leaveDates.map((date) => new Date(date));

    const leave = await Leave.build({
      name,
      message,
      leaveDate: parsedDates,
    }).save();

    // Send initial email notification
    await sendInitialLeaveEmail(name, message, parsedDates);

    // If leave includes today, send Slack message immediately
    const today = new Date();
    if (
      parsedDates.some((date) => date.toDateString() === today.toDateString())
    ) {
      await sendToPublicChannel(name, message);
    }

    res.status(201).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    const leaves = await Leave.find();

    for (const leave of leaves) {
      const leaveDates = Array.isArray(leave.leaveDate)
        ? leave.leaveDate
        : [leave.leaveDate];

      if (
        leaveDates.some(
          (date) => new Date(date).toDateString() === today.toDateString()
        )
      ) {
        await sendDailyLeaveReminder(leave.name, leave.message);
        await sendToPublicChannel(leave.name, leave.message);
      }
    }
  } catch (error) {
    logger.error("Error in daily leave notification cron:", error);
  }
});

export { createLeaveRequest as createLeaveRequestHandler };
