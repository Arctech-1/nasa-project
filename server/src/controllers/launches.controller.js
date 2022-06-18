const { existsLaunchWithId, getAllLaunches, addNewlaunch, abortLaunchById } = require("../models/launches.model");

async function httpGetAllLaunches(req, res) {
  //convert launches map to array
  const pageNo = Number(req.query.page);
  const limit = Number(req.query.limit);
  console.log(pageNo, limit);
  res.status(200).json(await getAllLaunches(pageNo, limit));
}

async function httpAddNewlaunch(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({ error: "Missing launch property" });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid launch date" });
  }
  await addNewlaunch(launch);
  res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  //check if launch exist
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({ error: "Launch not found" });
  }

  const aborted = abortLaunchById(launchId);
  if (!aborted) return res.status(400).json({ error: "Launch not aborted" });
  return res.status(200).json({ ok: "true" });
}

module.exports = { httpGetAllLaunches, httpAddNewlaunch, httpAbortLaunch };
