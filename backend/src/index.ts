import { Hono } from "hono";

const app = new Hono();

/**
 * *Routes
 */
app.route("/api/v1/user", userRouter);
app.route("/api/v1/candidate", candidateRouter);

export default app;
