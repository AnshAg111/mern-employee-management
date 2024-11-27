require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const mongoose = require("mongoose");
const auth = require("./middlewares/auth");


const app = express();

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(require("cors")());

// routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/employee"));

// server configurations.
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`server listening on port: ${PORT}`);
});