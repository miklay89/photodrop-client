import dotenv from "dotenv";
import express from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import userRoutes from "./routes/user";
import payRoutes from "./routes/pay";
import errorHandler from "./utils/error_handler";

dotenv.config();

const app = express();

// cors, cookie-parser, body-parser
app.use(
  cors({
    origin: [
      "https://photodrop-clients.vercel.app/",
      "http://192.168.0.157:3000",
      "http://192.168.0.157:5173",
      `https://pd-client.onrender.com:${process.env.PORT}`,
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/user", userRoutes);
app.use("/pay", payRoutes);

// handle errors
app.use(errorHandler);

// starting server
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server has been started on http://localhost:${
      process.env.PORT || 5000
    }...`,
  );
});
