import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/database";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/rateLimiter";
import { authenticateUserRouter } from "./routes/auth/auth";
import { requireAuth } from "./middlewares/auth";

const app = express();

// Connect to Database
connectDB();

// Middleware
// app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));
app.use(apiLimiter);

// Routes
app.use("/api/auth", authenticateUserRouter);

app.use("/api", requireAuth, routes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
