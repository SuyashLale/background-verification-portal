import { Hono } from "hono";

export const userRouter = new Hono();

/**
 * *POST: Signup user
 */
userRouter.post("/signup", async (c) => {
    return c.json({
        msg: "/signup user",
    });
});
