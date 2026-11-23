/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Database model containing SQL queries for topics and trivia questions.
*/

// Import the PostgreSQL connection pool
let pool = require("../config/db");

// Function to get all topics
async function getAllTopics(){
    let result = await pool.query('SELECT id, name FROM topics ORDER BY name ASC');
    return result.rows; 

}

// Function to get questions by topic ID
async function getTopicById(topicId){
    let result = await pool.query('SELECT id, name FROM topics WHERE LOWER(name) = LOWER($1)', [topicId]);
    return result.rows[0]; 
}
// Function to get questions by topic ID, difficulty, and limit
async function getQuestionsByTopicId(topicId, difficulty, limit){
    let query = 'SELECT q.id, t.name, q.question, q.answer, q.difficulty FROM questions q JOIN topics t ON q.topic_id = t.id WHERE LOWER(t.name) = LOWER($1)';
    let params = [topicId];
    // Add difficulty filter if provided
    if (difficulty) {
        params.push(difficulty.toLowerCase());
        query += ` AND q.difficulty = $${params.length}`;
    }
    query += ' ORDER BY q.id ASC';
    // Add limit if provided
    if (limit) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;
    }
    let result = await pool.query(query, params);
    return result.rows;

}

// Getting random question
async function getRandomQuestion(){
    let query = 'SELECT q.id, t.name AS topic, q.question, q.answer, q.difficulty FROM questions q JOIN topics t ON q.topic_id = t.id ORDER BY RANDOM() LIMIT 1';
    let result = await pool.query(query);
    return result.rows[0];

}

//getting question by id
async function getQuestionById(questionId){
    let result = await pool.query('SELECT id, question, answer, difficulty FROM questions WHERE id = $1', [questionId]);
    return result.rows[0];
}

//adding new question
async function addQuestion(topicId, questionText, answerText, difficulty){
    let cleanTopic = topicId.trim().toLowerCase();
    let topicRecord = await getTopicById(cleanTopic);
    if (!topicRecord) {
        let insertTopicResult = await pool.query('INSERT INTO topics (name) VALUES ($1) RETURNING id', [cleanTopic]);
        topicRecord = insertTopicResult.rows[0];
    }
    await pool.query('INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)', [topicRecord.id, questionText.trim(), answerText.trim(), difficulty.toLowerCase()]);
    return getQuestionsByTopicId(cleanTopic, null, null);
}


// Export the functions for use in other modules
module.exports = {
    getAllTopics,
    getTopicById,
    getQuestionsByTopicId,
    getRandomQuestion,
    getQuestionById,
    addQuestion
};  
