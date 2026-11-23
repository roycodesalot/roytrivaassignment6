# roytrivaassignment6

A full stack web application that lets a user test their knowledge based on the available topics, get randomized questions, and create new questions in a PostgreSQL database. Uses Node.js, Express, PostgreSQL, and vanilla HTML/CSS/JS.


**Live Deployed App:** https://roytrivaassignment6.onrender.com

## Database Schema (PostgreSQL)
- **topics**

Saves unique lowercase topic names (`id`, `name`).

- **questions**

Saves trivia questions (`id`, `topic_id`, `question`, `answer`, `difficulty`), where `topic_id` references `topics(id)` and `difficulty` only accepts `easy`, `medium`, or `hard`.



## Local Setup Steps
1. Clone the repository and open the project folder.
2. Run `npm install` to install `express`, `pg`, `dotenv`, `cors`.
3. Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   PORT=3000
   ```

4. Run `node seed.js` to create the tables and load the questions.
5. Run `node server.js` and visit `http://localhost:3000`.


## API Endpoints
- `GET /triviabook/topics` = 200 means GOOD, Array of topic objects science and geography

- `GET /triviabook/topic/:topic` = 200 means GOOD, returns all questions for the given :topic supports optional ?difficulty= and ?limit= query filters plus 400 if those filters are invalid, and 404 if the topic isn't found.


- `GET /triviabook/random` = 200 means Good, 1 random questionObject without the answer of the question.

- `POST /triviabook/answer` = 200 means Good,
EXAMPLE
---------
 {"correct": true,
"correctAnswer": "Mars"}

missing field returns 400 
Accepts id and guess in the body, trims spaces, ignores uppercase/lowercase, and returns 404 if the ID is not found.

- `POST /triviabook/question/add` = 201 Created Question, Accepts topic, question, answer, and difficulty in the body which returns 400 if any field is missing or invalid.