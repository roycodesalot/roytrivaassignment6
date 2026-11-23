/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Controller handling request validation, error responses, and business logic for Triviabook
endpoints.
*/

// Import the trivia model for database operations
let triviaModel = require("../models/trivia-model");
let VALID_DIFFICULTIES = ["easy", "medium", "hard"];

// Function to get all topics
async function getAllTopics(req, res) {
    try {
        let topics = await triviaModel.getAllTopics();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// Function to get questions by topic ID, difficulty, and limit
async function getQuestionsByTopicId(req, res) {
    try {
        let topicParam = req.params.topic;
        let difficulty = req.query.difficulty;
        let limit = req.query.limit;

        let topicExists = await triviaModel.getTopicById(topicParam);
        if (!topicExists) {
            return res.status(404).json({ error: "Topic not found." });
        }

        let parsedLimit = null;
        if (limit !== undefined) {
            parsedLimit = parseInt(limit);
            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return res
                    .status(400)
                    .json({ error: "Limit must be higher than zero." });
            }
        }

        let questions = await triviaModel.getQuestionsByTopicId(
            topicParam,
            difficulty,
            parsedLimit,
        );
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: "Could not retrieve questions." });
    }
}

//gettting random question
async function getRandomQuestion(req, res) {
    try {
        let question = await triviaModel.getRandomQuestion();
        if (!question) {
            return res
                .status(404)
                .json({ error: " Try Again. No Question Was Provided." });
        }
        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({
            error: " Try Again. NO Random Question Was Found",
        });
    }
}

//checking the answer
async function checkAnswer(req, res) {
    try {
        let { id, guess } = req.body;

        if (
            id === undefined ||
            guess === undefined ||
            String(guess).trim() === ""
        ) {
            return res.status(400).json({ error: " Try Again Invalid Input." });
        }

        let question = await triviaModel.getQuestionById(id);
        if (!question) {
            return res
                .status(400)
                .json({ error: "Question with id ${id} does not exist." });
        }

        let correctAnswer =
            String(guess).trim().toLowerCase() ===
            question.answer.trim().toLowerCase();
        res.status(200).json({
            correct: correctAnswer,
            correctAnswer: question.answer,
        });
    } catch (err) {
        res.status(500).json({ error: "Try Again Failed To Answer" });
    }
}

//creating new questions
async function createQuestion(req, res) {
    try {
        let { topic, question, answer, difficulty } = req.body;
        if (!topic || !question || !answer || !difficulty) {
            return res.status(400).json({
                error: "All four attributes (topic, question, answer, difficulty) are required.",
            });
        }
        if (!VALID_DIFFICULTIES.includes(difficulty.trim().toLowerCase())) {
            return res.status(400).json({
                error: "Invalid difficulty. Must be easy, medium, or hard.",
            });
        }
        let updatedQuestions = await triviaModel.addQuestion(
            topic,
            question,
            answer,
            difficulty,
        );
        res.status(201).json(updatedQuestions);
    } catch (err) {
        res.status(500).json({ error: "Failed to add new question." });
    }
}
module.exports = {
    fetchTopics: getAllTopics,
    fetchQuestionsByTopic: getQuestionsByTopicId,
    fetchRandomQuestion: getRandomQuestion,
    checkAnswer,
    createQuestion,
};
