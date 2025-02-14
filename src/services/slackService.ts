import slack from "../config/slack";
import logger from "../utils/logger";

export const sendToPrivateChannel = async (message: string): Promise<void> => {
  try {
    const formattedMessage = {
      channel: process.env.SLACK_PRIVATE_CHANNEL!,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔒 New Anonymous Report",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: message,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Submitted: <!date^${Math.floor(
                Date.now() / 1000
              )}^{date_pretty} at {time}|${new Date().toLocaleString()}>`,
            },
          ],
        },
      ],
    };

    await slack.chat.postMessage(formattedMessage);
    logger.info("Report sent to Slack private channel successfully");
  } catch (error) {
    logger.error("Error sending to Slack:", error);
    throw error;
  }
};

export const sendToPublicChannel = async (
  name: string,
  message: string
): Promise<void> => {
  try {
    await slack.chat.postMessage({
      channel: process.env.SLACK_PUBLIC_CHANNEL!,
      text: `📝 Leave  from ${name}:\n${message}`,
      unfurl_links: false,
    });
    logger.info("Message sent to public Slack channel");
  } catch (error) {
    logger.error("Error sending to public Slack channel:", error);
    throw error;
  }
};
