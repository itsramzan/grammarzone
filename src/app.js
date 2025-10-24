import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import grammarRoutes from "./routes/grammar.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View & Static Setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/", grammarRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
