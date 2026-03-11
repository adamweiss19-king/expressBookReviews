const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
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

const authenticatedUser = (username,password)=> { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // If at least one matching user is found, return true
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
    
    // 1. Check if username and password are provided
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    
    // 2. Authenticate the user
    if (authenticatedUser(username, password)) {
        // 3. Generate a JWT token
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        // 4. Save the token and username to the session
        req.session.authorization = {
        accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        // 5. If authentication fails
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
    });

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;

  if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      // EXACT message requested by the feedback
      return res.status(200).json({
          message: `The review for the book with ISBN ${isbn} has been added/updated.`
      });
  }
  return res.status(404).json({message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Ensure your login task sets this!

  if (books[isbn]) {
      let book = books[isbn];
      if (book.reviews[username]) {
          delete book.reviews[username];
          // EXACT message requested by the feedback
          return res.status(200).json({message: `Review for ISBN ${isbn} deleted`});
      } else {
          return res.status(404).json({message: "No review found for this user"});
      }
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
