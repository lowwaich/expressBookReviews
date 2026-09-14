const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

const getAllBooks = (books) => {
    return new Promise((resolve, reject) => {
        let allBooks = books;
        setTimeout(() => {
            if (allBooks) {
                console.log(`Books database fetched`);
                resolve(allBooks);
            } else {
                reject(new Error(`There are no books available at the moment`));
            }
        }, 500);
    });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const booksdb = books;

    try {
        const fetchedBooks = await getAllBooks(booksdb);

        if (fetchedBooks) {
            res.send(JSON.stringify(fetchedBooks, null, 4));
        } else {
            res.status(404).json({ message: `Could not find available books.` });
        }

    } catch (err) {
        console.error(`Error fetching data: ${err.message}.`);
        res.status(500).json({ message: `Internal Server Error while fetching books. Please try again` });
    }
});

const getBookByISBN = (books, isbn) => {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            console.log(`Book for ISBN fetched`);
            resolve(book);
        } else {
            reject(new Error(`There is no book for ISBN`));
        }
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const booksdb = books;

    try {
        const fetchedBook = await getBookByISBN(booksdb, isbn);

        if (fetchedBook) {
            res.send(fetchedBook);
        } else {
            res.status(404).json({ message: `Could not find book for ISBN.` });
        }

    } catch (err) {
        console.error(`Error fetching data: ${err.message}.`);
        res.status(500).json({ message: `Internal Server Error while fetching books. Please try again` });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Extract the author parameter from the request URL
    const author = req.params.author;

    // Convert object values into an array, then filter by author
    const all_books = Object.values(books);
    let filtered_books = all_books.filter((book) => book.author === author);

    // Send the filtered results neatly formatted
    return res.send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Extract the title parameter from the request URL
    const title = req.params.title;

    // Convert object values into an array, then filter by title
    const all_books = Object.values(books);
    let filtered_books = all_books.filter((book) => book.title === title);

    // Send the filtered results neatly formatted
    return res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
