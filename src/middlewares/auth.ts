import { NextFunction, Request, Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: any;
    }
  }
}

export const validateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization?.replace("Bearer ", "");

    if (!bearerToken) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    try {
      // Use the newer verification method
      const claims = await clerkClient.verifyToken(bearerToken);

      if (!claims) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      // Find or create user in your database
      let user = await User.findOne({ clerkId: claims.sub });

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(claims.sub);

        user = await User.create({
          clerkId: claims.sub,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        });
      }

      req.user = user;
      req.auth = claims;
      next();
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Authentication failed" });
    return;
  }
};
