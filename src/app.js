
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./route/userroute');
const postRoutes = require('./route/postroute');
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


// Middleware to parse JSON data
app.use(bodyParser.json());

// In-memory user data store (Replace this with a real database in production)
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the CRUD API!");
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
