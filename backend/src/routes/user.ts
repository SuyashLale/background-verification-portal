import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

/**
 * *POST: Signup user
 */
userRouter.post("/signup", async (c) => {
    // Initiate the prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // Safe parse the request body
    // Do zod validation here....

    // Handle request
    try {
        const dt = new Date();
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                createdAt: dt,
                updatedAt: dt,
            },
        });

        // Create the JWT and return it
        const token = await sign({ id: user.id }, c.env.JWT_SECRET);
        c.status(200);
        return c.json({
            message: "Signed up successfully",
            token,
        });
    } catch (e) {
        console.log("Internal error /user/signup: ", e);
        c.status(500);
        return c.json({
            error: "Internal Error: /user/signup",
        });
    }
});

/**
 * * POST: Signin user
 */
userRouter.post("/signin", async (c) => {
    // Initialize the prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // Do zod validation here...

    // Handle request
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password,
            },
        });
        if (!user) {
            c.status(403);
            return c.json({
                error: "Unauthorized",
            });
        }

        // Create JWT and return it
        const token = await sign({ id: user.id }, c.env.JWT_SECRET);
        c.status(200);
        return c.json({
            message: "Signed-in successfully",
            token,
        });
    } catch (e) {
        console.log("Internal error /user/signin: ", e);
        c.status(500);
        return c.json({
            erro: "Internal error: /user/signin",
        });
    }
});
