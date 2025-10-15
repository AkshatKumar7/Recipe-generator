import express from "express";
import plannerRouter from "./planner.js";
import authRouter from "./auth.js";
import recipesRouter from "./recipes.js";
import recognitionRouter from "./recognition.js";
import userRouter from "./user.js";

const mainRouter = express.Router();

mainRouter.use("/planner", plannerRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/recipes", recipesRouter);
mainRouter.use("/recognition", recognitionRouter);
mainRouter.use("/user", userRouter);

export default mainRouter;

