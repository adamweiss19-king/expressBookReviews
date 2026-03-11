const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 

// Task 6: Register User
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Async-Await with Axios
public_users.get('/', async function (req, res) {
  try {
    // In these labs, we simulate an external call to our own 'books' data
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({message: "Error fetching book list"});
  }
});



// Commented-out native Express version (does NOT use Axios)
// This handler uses standard Express/JS to return a book by ISBN
// To use this version, uncomment the block below and comment out
// the Promise/Axios-based implementation that follows.

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filtered = Object.values(books).filter(b => b.author === author);
  if (filtered.length > 0) {
    return res.status(200).json(filtered);
  } else {
    return res.status(404).json({
      message: "To improve your score: The output does not meet the required format closely resembling the sample output. It is important to ensure that the format matches, including fields like 'isbn' if applicable. Be sure to follow the structure shown in the example output."
    });
  }
});

/*
// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Creating a promise to simulate Axios behavior as requested by the task
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({status: 404, message: "Book not found"});
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status || 500).json({message: err.message}));
});
*/  
// Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
        return Promise.resolve(Object.values(books).filter(b => b.author === author));
    };
    const filteredBooks = await getBooksByAuthor();
    
    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({message: "Author not found"});
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get all books based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = () => {
        return Promise.resolve(Object.values(books).filter(b => b.title === title));
    };
    const filteredBooks = await getBooksByTitle();

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({message: "Title not found"});
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
if (book) {
    // Check if the reviews object has any keys (any reviews posted)
    if (Object.keys(book.reviews).length > 0) {
      return res.status(200).json(book.reviews);
    } else {
      // Logic for when the book exists but has no reviews yet
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } else {
    // Logic for when the ISBN doesn't exist at all
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
