import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import topicRoutes from "./routes/topic.routes";
import userRoutes from "./routes/user.routes";
import morgan from "morgan";
import session from 'express-session';
import MongoStore from 'connect-mongo';



const app = express();

// middleware
app.use(morgan("dev")); // rendering HTTP Codes
app.use(express.json());

//session
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_STRING }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

//routes
app.use("/api/topics", topicRoutes);
app.use("/api/auth", userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
