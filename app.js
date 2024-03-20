const exprasse = require("express");
const mongoose = require("mongoose");
const coneectToDb = require("./config/db");
require("dotenv").config();
// connect to db
coneectToDb();
// start exprasse
const app = exprasse();

// apply Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes

// handel errors
// app.use(notFound);
// app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("The Courses is Connected  ");
});
