/* API versioningf  */
const express = require("express");

const planetsRouter = require("../routes/planets.router");
const launchesRouter = require("../routes/launches.router");

const api = express.Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;
