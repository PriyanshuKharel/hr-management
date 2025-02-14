import { WebClient } from "@slack/web-api";
import logger from "../utils/logger";

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Verify configuration on startup
const verifySlackConfig = async () => {
  try {
    const auth = await slack.auth.test();
    logger.info(`Slack bot connected as ${auth.bot_id}`);
    return true;
  } catch (error) {
    logger.error("Slack configuration error:", error);
    return false;
  }
};

verifySlackConfig();

export default slack;
