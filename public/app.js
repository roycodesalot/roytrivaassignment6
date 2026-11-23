/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Client-side JavaScript connecting the Triviabook UI to the Express REST API.
*/

let currentRandomId = null;

async function loadTopics() {
    let list = document.getElementById("topics-list");
    list.innerHTML = "";
    let response = await fetch("/triviabook/topics");
    let data = await response.json();
    if (!response.ok) {
        let errItem = document.createElement("li");
        errItem.textContent = data.error || "Error loading topics.";
        list.appendChild(errItem);
        return;
    }
    for (let topic of data) {
        let item = document.createElement("li");
        item.textContent = topic.name;
        list.appendChild(item);
    }
}

async function loadRandomQuestion() {
    let box = document.getElementById("random-question-box");
    let feedback = document.getElementById("answer-feedback");
    box.innerHTML = "";
    feedback.textContent = "";
    let response = await fetch("/triviabook/random");
    let data = await response.json();
    if (!response.ok) {
        box.textContent = data.error || "Could not load random question.";
        return;
    }
    currentRandomId = data.id;
    let prompt = document.createElement("p");
    prompt.textContent = `[${data.topic.toUpperCase()} - ${data.difficulty}] ${data.question}`;
    box.appendChild(prompt);
}

async function handleAnswerSubmit(event) {
    event.preventDefault();
    let feedback = document.getElementById("answer-feedback");
    let guessInput = document.getElementById("guess-input");
    if (!currentRandomId) {
        feedback.textContent = 'Please click "Get Random Question" first!';
        return;
    }
    let response = await fetch("/triviabook/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: currentRandomId,
            guess: guessInput.value,
        }),
    });
    let data = await response.json();
    if (!response.ok) {
        feedback.textContent = data.error || "Error checking answer.";
        return;
    }
    if (data.correct) {
        feedback.textContent = `Correct! The answer is ${data.correctAnswer}.`;
    } else {
        feedback.textContent = `Incorrect. The correct answer is ${data.correctAnswer}.`;
    }
    guessInput.value = "";
}

async function handleTopicSearch(event) {
    event.preventDefault();
    let container = document.getElementById("topic-questions-list");
    container.innerHTML = "";
    let topic = document.getElementById("topic-input").value.trim();
    let difficulty = document.getElementById("difficulty-select").value;
    let limit = document.getElementById("limit-input").value;
    let params = new URLSearchParams();
    if (difficulty) {
        params.append("difficulty", difficulty);
    }
    if (limit) {
        params.append("limit", limit);
    }
    let queryString = params.toString();

    let url = `/triviabook/topic/${encodeURIComponent(topic)}${queryString ? "?" + queryString : ""}
`;
    let response = await fetch(url);
    let data = await response.json();
    if (!response.ok) {
        let errMsg = document.createElement("p");
        errMsg.textContent = data.error || "Topic not found.";
        container.appendChild(errMsg);
        return;
    }
    for (let q of data) {
        let item = document.createElement("div");
        item.className = "question-item";
        let title = document.createElement("p");
        title.textContent = `Q: ${q.question} (${q.difficulty})`;
        let ans = document.createElement("p");
        ans.textContent = `A: ${q.answer}`;
        item.appendChild(title);
        item.appendChild(ans);
        container.appendChild(item);
    }
}

async function handleAddQuestion(event) {
    event.preventDefault();
    let feedback = document.getElementById("add-feedback");
    let payload = {
        topic: document.getElementById("new-topic").value,
        question: document.getElementById("new-question").value,
        answer: document.getElementById("new-answer").value,
        difficulty: document.getElementById("new-difficulty").value,
    };
    let response = await fetch("/triviabook/question/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    let data = await response.json();
    if (!response.ok) {
        feedback.textContent = data.error || "Failed to add question.";
        return;
    }
    feedback.textContent = `Question added! Topic now has ${data.length} question(s).`;
    document.getElementById("add-question-form").reset();
    loadTopics();
}
document
    .getElementById("load-topics-btn")
    .addEventListener("click", loadTopics);
document
    .getElementById("random-btn")
    .addEventListener("click", loadRandomQuestion);
document
    .getElementById("answer-form")
    .addEventListener("submit", handleAnswerSubmit);
document
    .getElementById("search-form")
    .addEventListener("submit", handleTopicSearch);
document
    .getElementById("add-question-form")
    .addEventListener("submit", handleAddQuestion);
loadTopics();
