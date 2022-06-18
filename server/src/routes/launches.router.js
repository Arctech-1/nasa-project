const express = require("express");
const { httpGetAllLaunches, httpAddNewlaunch, httpAbortLaunch } = require("../controllers/launches.controller");
const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewlaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
