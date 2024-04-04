const express = require("express");
const coneectToDb = require("./config/db");
const { handelError, notFound } = require("./middlewares/error");
require("dotenv").config();
const cors = require("cors");
// connect to db
coneectToDb();
// start exprasse
const app = express();

// apply Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// cors
app.use(cors());
// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRouter"));
app.use("/api/posts", require("./routes/PostsRoute"));
app.use("/api/comments", require("./routes/commentRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));

// handel errors
app.use(notFound);
app.use(handelError);
// app.use(notFound);
// app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("The Courses is Connected  ");
});
