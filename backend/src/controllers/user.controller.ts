import { RequestHandler } from "express";
import { getSession } from "next-auth/react";
import createHttpError from "http-errors";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import "next-auth"; 
import { DefaultSession } from "next-auth";


declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
  }
}


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const session = await getSession({ req });
        if (!session || !session.user || !session.user.id) {
            throw createHttpError(401, "User not authenticated");
        }

        const user = await UserModel.findById(session.user.id).select("+email").exec();
        if (!user) {
            throw createHttpError(404, "User not found");
        }
        res.status(200).json(user);
    } catch (error) {
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

        res.status(201).json(newUser);
    } catch (error) {
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
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username }).select("+password +email").exec();

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createHttpError(401, "Invalid credentials");
        }

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};