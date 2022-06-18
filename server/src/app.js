const express = require("express");
const app = express();
const cors = require("cors");

const planetsRouter = require("./routes/planets.router");
const launchesRouter = require("./routes/launches.router");

const api = require("./routes/api");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

/**
 * End points
 * versioning our api
 *  */
app.use("/v1", api);

app.get("/", (req, res) => res.json("nasa project"));

module.exports = app;
