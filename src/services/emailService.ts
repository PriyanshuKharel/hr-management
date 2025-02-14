import transporter from "../config/email";
import { formatDateRange } from "../utils/dateUtils";
import logger from "../utils/logger";

interface EmailConfig {
  recipientEmails: string[];
  senderEmail: string;
  senderName: string;
}

const emailConfig: EmailConfig = {
  recipientEmails: [process.env.HR_EMAIL_1!, process.env.HR_EMAIL_2!],
  senderEmail: process.env.SENDER_EMAIL!,
  senderName: "WiseAdmit HR System",
};

export const sendAnonymousReport = async (message: string): Promise<void> => {
  try {
    const emailContent = {
      from: `"${emailConfig.senderName}" <${emailConfig.senderEmail}>`,
      to: emailConfig.recipientEmails.join(", "), // Send to multiple recipients
      subject: "New Anonymous Report",
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
          <div style="background-color: #ff4444; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🔒 New Anonymous Report</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Sent at: ${new Date().toLocaleString()}<br>
                This is an automated message from the Anonymous Reporting System.<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(emailContent);
    logger.info("Anonymous report email sent successfully to all recipients");
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};

export const sendInitialLeaveEmail = async (
  name: string,
  message: string,
  leaveDates: Date[]
) => {
  try {
    const today = new Date();
    const isForToday = leaveDates.some(
      (date) => date.toDateString() === today.toDateString()
    );

    const dateStr =
      leaveDates.length === 1
        ? leaveDates[0].toLocaleDateString()
        : `from ${leaveDates[0].toLocaleDateString()} to ${leaveDates[
            leaveDates.length - 1
          ].toLocaleDateString()}`;

    const emailContent = {
      from: `"${emailConfig.senderName}" <${emailConfig.senderEmail}>`,
      to: emailConfig.recipientEmails.join(", "),
      subject: `Leave Request from ${name}`,
      text: isForToday
        ? `${name} is taking leave today.`
        : `${name} will be on leave ${dateStr}.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
          <div style="background-color: #4CAF50; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">📝 Leave Description</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; color: #666;">Employee:</td>
                <td style="padding: 8px; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #666;">Duration:</td>
                <td style="padding: 8px;">${dateStr}</td>
              </tr>
            </table>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Request submitted at: ${new Date().toLocaleString()}<br>
                This is an automated message from the HR System.<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(emailContent);
    logger.info("Leave notification email sent successfully");
  } catch (error) {
    logger.error("Error sending leave notification:", error);
    throw error;
  }
};

export const sendDailyLeaveReminder = async (name: string, message: string) => {
  try {
    const emailContent = {
      from: `"${emailConfig.senderName}" <${emailConfig.senderEmail}>`,
      to: emailConfig.recipientEmails.join(", "),
      subject: `Leave Reminder: ${name} is on Leave Today`,
      text: `${name} is on leave today.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
          <div style="background-color: #2196F3; color: white; padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🗓️ Leave Reminder</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0;">${name} is on Leave Today</h3>
              <p style="color: #666;">${new Date().toLocaleDateString()}</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Reminder sent at: ${new Date().toLocaleString()}<br>
                This is an automated reminder from the HR System.<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(emailContent);
    logger.info("Daily leave reminder email sent successfully");
  } catch (error) {
    logger.error("Error sending daily reminder:", error);
    throw error;
  }
};
