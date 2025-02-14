import { NextFunction, Request, Response } from "express";
import { clerk } from "../config/clerk";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: any;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
    }

    const sessionId = token!.split("_")[1];

    const session = await clerk.sessions.verifySession(sessionId, token!);
    if (!session) {
      res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findOne({ clerkId: session.userId });
    if (!user) {
      res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.auth = session;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
