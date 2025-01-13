const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let userFiltered = users.filter(u => u.username === username && u.password === password );
    
    if (userFiltered.length > 0) { 
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
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
  //Write your code here
  let review = req.query.review;
  let isbn = req.params.isbn;

  let username = req.session.authorization.username;
  
  let bookFiltered = books[isbn];
  if(!bookFiltered){
    res.send("isbn doesn't exist!");
  }
  let prevReviewExsist = bookFiltered.reviews[username];
  bookFiltered.reviews[username] = review;
  if(prevReviewExsist){
    res.send("The review of "+username+" was edited");
  }else{
    res.send("The review of "+username+" was added");

  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let review = req.query.review;
  let isbn = req.params.isbn;

  let username = req.session.authorization.username;
  
  let bookFiltered = books[isbn];
  if(!bookFiltered){
    res.send("isbn doesn't exist!");
  }
  
  let prevReviewExsist = delete bookFiltered.reviews[username];
  if(prevReviewExsist){
    res.send("The review of "+username+" was deleted");
  }else{
    res.send("There was no review of "+username);

  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
