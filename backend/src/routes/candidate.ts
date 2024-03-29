import { Hono } from "hono";

export const candidateRouter = new Hono();

/**
 * *GET: All candidates
 */
candidateRouter.get("/candidate", async (c) => {
    return c.json({
        msg: "/candidate get all",
    });
});
