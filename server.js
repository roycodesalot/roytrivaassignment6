/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Main Express application entry point serving static frontend assets and mounting Triviabook API
routes.
*/

let express = require("express");
let { join } = require("path");
require("dotenv").config();

let triviaRoutes = require("./routes/triva-routes");
let app = express();
let PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "public")));
app.use("/triviabook", triviaRoutes);
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
