import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";

// Typing for express-session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        // console.log("getAuthenticatedUser called"); // Log
        // console.log("Session:", req.session); // Log

        const userId = req.session.userId;
        if (!userId) {
            throw createHttpError(401, "User not authenticated");
        }

        const user = await UserModel.findById(userId).select("+email").exec();
        if (!user) {
            throw createHttpError(404, "User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        // console.error(error);
        next(error);
    }
};

interface SignUpBody {
    username?: string;
    email?: string;
    password?: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email, password: passwordRaw } = req.body;

    try {
        // console.log("signUp called with:", { username, email, passwordRaw }); // Log
        // console.log("Session:", req.session); // Log

        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username,
            email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id.toString(); 

        res.status(201).json(newUser);
    } catch (error) {
        // console.error(error); // Log
        next(error);
    }
};

interface LoginBody {
    username?: string;
    password?: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // console.log("login called with:", { username, password }); // Log
        // console.log("Session:", req.session); // Log

        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username }).select("+password +email").exec();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id.toString(); // Convert ObjectId to string
        res.status(201).json(user);
    } catch (error) {
        console.error(error); // Log
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    try {
        console.log("logout called"); // Log
        req.session.destroy(error => {
            if (error) {
                next(error);
            } else {
                res.sendStatus(200);
            }
        });
    } catch (error) {
        // console.error(error); // Log
        next(error);
    }

};
