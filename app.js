const express = require("express");
const mongoose = require("mongoose");
const coneectToDb = require("./config/db");
require("dotenv").config();
// connect to db
coneectToDb();
// start exprasse
const app = express();

// apply Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/auth", require("./routes/authRoute"));
// handel errors
// app.use(notFound);
// app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("The Courses is Connected  ");
});
