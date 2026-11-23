/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Express router mapping /triviabook API endpoints to controller handlers.
*/

let express = require("express");
let router = express.Router();
let triviaController = require("../controllers/trivia-controller");

router.get("/topics", triviaController.fetchTopics);
router.get("/topic/:topic", triviaController.fetchQuestionsByTopic);
router.get("/random", triviaController.fetchRandomQuestion);
router.post("/answer", triviaController.checkAnswer);
router.post("/question/add", triviaController.createQuestion);

module.exports = router;
