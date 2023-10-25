const express = require("express");
const axios = require("axios"); // Import Axios for making HTTP requests
const books = require("./booksdb.js");
const public_users = express.Router();

// Task 10: Get the list of books available in the shop using Promise callbacks or async-await with Axios
public_users.get("/", async (req, res) => {
    try {
        const response = await axios.get(
            "http://localhost:5000/customer/books"
        ); // Replace with your API endpoint
        const bookList = response.data;
        res.json(bookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get("/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(
            `http://localhost:5000/customer/books/isbn/${isbn}`
        ); // Replace with your API endpoint
        const bookDetails = response.data;
        res.json(bookDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Task 12: Get book details based on Author using Promise callbacks or async-await with Axios
public_users.get("/author/:author", async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(
            `http://localhost:5000/customer/books/author/${author}`
        ); // Replace with your API endpoint
        const matchingBooks = response.data;
        res.json(matchingBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Task 13: Get book details based on Title using Promise callbacks or async-await with Axios
public_users.get("/title/:title", async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(
            `http://localhost:5000/customer/books/title/${title}`
        ); // Replace with your API endpoint
        const matchingBooks = response.data;
        res.json(matchingBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports.general = public_users;
