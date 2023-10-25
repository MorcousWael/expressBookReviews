const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = "your-secret-key";

let users = [];

const isValid = (username) => {
    return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
    const user = users.find((user) => user.username === username);
    return user && user.password === password;
};

// Task 7: Login and create a JWT session
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are valid
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Authentication failed" });
    }

    // Create a JWT token
    const token = jwt.sign({ username }, secretKey);

    // Store the token in the user's session
    req.session.authorization = { accessToken: token };

    // Respond with the token
    res.status(200).json({ message: "Login successful", token });
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.body.reviews; // Assuming the review text is in the "reviews" field of the request body

    // Check if books[isbn].reviews is an array or initialize it as an empty array
    if (!Array.isArray(books[isbn].reviews)) {
        books[isbn].reviews = [];
    }

    // Find the index of the review by the authenticated user, if it exists
    const reviewIndex = books[isbn].reviews.findIndex(
        (review) => review.username === req.user.username
    );

    if (reviewIndex !== -1) {
        // If the user has already reviewed this book, update their existing review
        books[isbn].reviews[reviewIndex].review = reviewText;
    } else {
        // If the user hasn't reviewed this book before, add a new review
        books[isbn].reviews.push({
            username: req.user.username,
            review: reviewText,
        });
    }

    // Respond with a success message or updated book data
    res.status(200).json({
        message: "Review added or updated successfully",
        book: books[isbn],
    });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username; // Retrieve the username from the session

    // Check if the book with the provided ISBN exists in 'books' and delete the review
    if (books[isbn]) {
        books[isbn].reviews = books[isbn].reviews || [];

        // Filter and delete reviews based on the session username
        books[isbn].reviews = books[isbn].reviews.filter(
            (userReview) => userReview.username !== username
        );

        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
