const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // 1. Get the username directly from the session
  const username = req.session.authorization?.username;

  if (!username) {
      return res.status(403).json({ message: "User not logged in" });
  }

  const isbn = req.params.isbn;
  const review = req.body.review; // or req.body.review depending on project specs

  // 2. Logic to add/update the review using the username
  if (books[isbn]) {
      // Initialize reviews object if it doesn't exist
      if (!books[isbn].reviews) {
          books[isbn].reviews = {};
      }
      
      // Save or update the review under this specific username
      books[isbn].reviews[username] = review;
      
      return res.status(200).json({ 
          message: `Review successfully added/updated by ${username}` 
      });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
