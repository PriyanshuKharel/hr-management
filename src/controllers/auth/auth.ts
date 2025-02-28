import { Response, Request, NextFunction } from "express";
import { User } from "../../models/user";
import { clerk } from "../../config/clerk";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    console.log("token", token);

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const sessionId = token.split("_")[1];
    console.log("sessionId", sessionId);
    if (!sessionId) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const session = await clerk.sessions.verifySession(sessionId, token);
    const clerkUser = await clerk.users.getUser(session.userId);

    // Check if user already exists
    let user = await User.findOne({ clerkId: clerkUser.id });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImage: clerkUser.imageUrl,
        lastLogin: new Date(),
      });
    } else {
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
    }

    return res.json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export { authenticateUser as authenticateUserHandler };
