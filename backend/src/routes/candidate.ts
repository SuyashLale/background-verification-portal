import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const candidateRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

/**
 * *MW: Auth routes
 */
candidateRouter.use("/*", async (c, next) => {
    // Check if the user is signed in
    try {
        // Get the auth token from the header
        const token = c.req.header("authorization") || undefined;
        if (!token) {
            c.status(403);
            return c.json({
                error: "Unauthorized: No header info found",
            });
        }

        // Verify the token
        const decoded = await verify(token, c.env.JWT_SECRET);

        if (decoded) {
            await next();
        } else {
            c.status(403);
            return c.json({
                error: "Unauthorized: auth token invalid",
            });
        }
    } catch (e) {
        console.log("Internal error Auth route: ", e);
        c.status(500);
        return c.json({
            error: "Internal error: auth MW /candidate",
        });
    }
});

/**
 * *POST: Add a candidate
 */
candidateRouter.post("/new", async (c) => {
    try {
        // Initialize the prisma client
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Get the request body
        const body = await c.req.json();

        // Do zod validation here....

        // Handle request
        const dt = new Date();
        const candidate = await prisma.candidate.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                dob: body.dob,
                zipcode: body.zipcode,
                ssn: body.ssn,
                createdAt: dt,
                updatedAt: dt,
            },
        });
        c.status(200);
        return c.json({
            message: "Candidate record created successfully",
            id: candidate.id,
        });
    } catch (e) {
        console.log("Internal error /candidate/new: ", e);
        c.status(500);
        return c.json({
            error: "Internal error: /candidate/new",
        });
    }
});

/**
 * *GET: All candidates
 */
candidateRouter.get("/candidate", async (c) => {
    return c.json({
        msg: "/candidate get all",
    });
});
