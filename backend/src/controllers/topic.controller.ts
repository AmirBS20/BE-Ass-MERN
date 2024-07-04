import { RequestHandler } from "express";
import TopicModel from "../models/topic.model";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import { error } from "console";

export const getTopics: RequestHandler = async (req, res, next) => {
    try {
        const topics = await TopicModel.find().exec();
        res.status(200).json(topics);
    } catch (error) {
        next(error);
    }
}

export const getTopic: RequestHandler = async (req, res, next) => {
    const topicId = req.params.topicId;
    try {
        if(!mongoose.isValidObjectId(topicId)) {
            throw createHttpError(400, "Invalid ID")
        }
        const topic = await TopicModel.findById(topicId).exec();

        if(!topic) {
            throw createHttpError(404, "Resource not found");
        }

        res.status(200).json(topic);
    } catch (error) {
        next(error);
    }
}

interface CreateTopicBody {
    title?: string,
    text?: string
}

interface UpdateTopicParams {
    topicId: string
}

interface updateTopicBody {
    title?: string,
    text?: string
}

export const createTopic: RequestHandler<unknown, unknown, CreateTopicBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    try {
        if (!title) {
            throw createHttpError(400, "Topic title is mandatory");
        }
        const newTopic = await TopicModel.create({
            title: title,
            text: text
        });
        res.status(201).json(newTopic);
    } catch (error) {
        next(error);
    }
}

export const updateTopic: RequestHandler<UpdateTopicParams, unknown, updateTopicBody, unknown> = async(req, res, next) => {
    const topicId = req.params.topicId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        if(!mongoose.isValidObjectId(topicId)) {
            throw createHttpError(400, "Invalid ID")
        }
        if(!newTitle) {
            throw createHttpError(400, "Topic title is mandatory");
        }
        const topic = await TopicModel.findById(topicId).exec();
        if(!topic) {
            throw createHttpError(404, "Topic not found");
        }   
        topic.title = newTitle;
        topic.text = newText;

        const updatedTopic = await topic.save();

        res.status(200).json(updatedTopic);
    } catch (error) {
        next(error);
    }
}

export const deleteTopic: RequestHandler = async (req, res, next) => {
    const topicId = req.params.topicId;
    try {
        if(!mongoose.isValidObjectId(topicId)) {
            throw createHttpError(400, "Invalid ID")
        }
        const topic = await TopicModel.findById(topicId).exec();
        if(!topic) {
            throw createHttpError(404, "Topic not found");
        }  
        await topic.deleteOne();

        res.sendStatus(204);
    } catch {
        next(error);
    }
}