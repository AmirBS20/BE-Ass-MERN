import express from "express";
import * as TopicController from "../controllers/topic.controller"

const router = express.Router();

router.get("/", TopicController.getTopics);

router.get("/:topicId", TopicController.getTopic);

router.post("/", TopicController.createTopic); 

router.patch("/:topicId", TopicController.updateTopic); 

router.delete("/:topicId", TopicController.deleteTopic);

export default router;