const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Extract the author parameter from the request URL
  const author = req.params.author;

  // Convert object values into an array, then filter by author
  const all_books = Object.values(books);
  let filtered_books = all_books.filter((book) => book.author === author);
  
  // Send the filtered results neatly formatted
  return res.send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Extract the title parameter from the request URL
  const title = req.params.title;
  
  // Convert object values into an array, then filter by title
  const all_books = Object.values(books);
  let filtered_books = all_books.filter((book) => book.title === title);
  
  // Send the filtered results neatly formatted
  return res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
