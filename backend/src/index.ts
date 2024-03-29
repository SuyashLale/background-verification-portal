import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { candidateRouter } from "./routes/candidate";

const app = new Hono();

/**
 * *Routes
 */
app.route("/api/v1/user", userRouter);
app.route("/api/v1/candidate", candidateRouter);

export default app;
