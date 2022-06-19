const axios = require("axios");

const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = require("./launches.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
//   flightNumber: 100,
//   mission: "Kepler Exploration",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };

// launches.set(launch.flightNumber, launch);
// saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populatelaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: { name: 1 },
        },
        {
          path: "payloads",
          select: { customers: 1 },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launches");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers: customers,
    };
    saveLaunch(launch);
  }
}
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already exists");
    return;
  }
  await populatelaunches();
}

async function findLaunch(filter) {
  return await launchesDb.findOne(filter);
}

async function existsLaunchWithId(id) {
  return await launchesDb.findOne({ flightNumber: id });
}

async function getAllLaunches(pageNumber, limit) {
  const hideFields = { _id: 0, __v: 0 };
  const query = {};
  const options = {
    select: hideFields,
    page: pageNumber || 1,
    limit: limit || 10,
    collation: {
      locale: "en",
    },
  };
  return await launchesDb.paginate(query, options);
  // return Array.from(launches.values());
}

async function saveLaunch(launch) {
  // check if the planet exists : refrential integrity approach

  await launchesDb.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

async function addNewlaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  // if (!planet) throw new Error("Couldn't find planet");
  let newFlightNumber = await getLatestFlightNumber();
  newFlightNumber++;
  // console.log(newFlightNumber);
  const newLaunch = Object.assign(launch, { flightNumber: newFlightNumber, customers: ["Zero to Mastery", "NASA"], upcoming: true, success: true });
  await saveLaunch(newLaunch);
  /*  launches.set(
    latestFlightNumber,
    Object.assign(launch, { flightNumber: latestFlightNumber, customers: ["Zero to Mastery", "NASA"], upcoming: true, success: true })
  ); */
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDb.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewlaunch,
  abortLaunchById,
  loadLaunchesData,
};
