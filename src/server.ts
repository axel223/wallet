import bodyParser from "body-parser";
import express from "express";

import connectDB from "../config/database";

import producer from "./eventControllers/producer";
import consumer from "./eventControllers/consumer";
import { router } from "./routes/router";

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api", router);

const port = app.get("port");
const server = app.listen(port, async () => {
    await producer.run();
    await consumer.init();
    console.log(`Server started on port ${port}`);
  }
);

export default server;
