import { clerkClient } from "@clerk/clerk-sdk-node";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Missing Clerk Secret Key");
}

export const clerk = clerkClient;
