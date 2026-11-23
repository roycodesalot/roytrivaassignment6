/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Creates the topics and questions tables in PostgreSQL and populates initial seed data.
*/
// Import the PostgreSQL connection pool
let pool = require("./config/db");
let query = pool.query.bind(pool);
let end = pool.end.bind(pool);

// Define the topics and questions to be seeded
let topics = ["science", "geography"];

// Define the questions for each topic
let scienceQuestions = [
    {
        question: "What planet is known as the Red Planet?",
        answer: "Mars",
        difficulty: "easy",
    },
    {
        question: "What is the chemical symbol for gold?",
        answer: "Au",
        difficulty: "medium",
    },
    {
        question: "What is the powerhouse of the cell?",
        answer: "Mitochondria",
        difficulty: "easy",
    },
];
let geographyQuestions = [
    {
        question: "What is the capital of Australia?",
        answer: "Canberra",
        difficulty: "medium",
    },
    {
        question: "Which river flows through Cairo?",
        answer: "The Nile",
        difficulty: "easy",
    },
];

// Function to create the topics and questions tables
async function seedDatabase() {
    try {
        // Create the topics table
        await query('DROP TABLE IF EXISTS questions');
        await query('DROP TABLE IF EXISTS topics');
        await query(`
            CREATE TABLE topics (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );
        `);
        // Create the questions table
        await query(`
            CREATE TABLE questions (
                id SERIAL PRIMARY KEY,
                topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
            );
        `);
        // Insert topics into the topics table
        for (let topic of topics) {
            await query('INSERT INTO topics (name) VALUES ($1);', [topic]);
        }
        // Insert science questions into the questions table
        let scienceRes = await query('SELECT id FROM topics WHERE name = $1;', ['science']);
        let scienceTopicId = scienceRes.rows[0].id;

        for (let item of scienceQuestions) {
            await query(
                'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4);',
                [scienceTopicId, item.question, item.answer, item.difficulty]
          );
        }  

        // Insert geography questions into the questions table
        let geographyRes = await query('SELECT id FROM topics WHERE name = $1;', ['geography']);
        let geographyTopicId = geographyRes.rows[0].id;
        
        for (let item of geographyQuestions) {
            await query(
                'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4);',
                [geographyTopicId, item.question, item.answer, item.difficulty]
            );
        }

        // Log a success message
        console.log("Database seeded successfully!");
    } catch (error) {
        // Log any errors that occur during the seeding process
        console.error("Error seeding database:", error);
    } finally {
        // Close the database connection pool
        await end();
    }
}

// Call the seedDatabase function to execute the seeding process
seedDatabase();