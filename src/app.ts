import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/database";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/rateLimiter";
import { authenticateUserRouter } from "./routes/auth/auth";
import { validateAuth } from "./middlewares/auth";

const app = express();

// Connect to Database
connectDB();

// Middleware
// app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));
app.use(apiLimiter);

// Auth routes (unprotected)
app.use("/api/oauth", authenticateUserRouter);

// Public routes
app.post("/api/auth", async (req, res) => {
  // Handle initial authentication
  res.json({ success: true });
});

// Protected routes
app.use("/api", validateAuth);
app.use("/api", routes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
