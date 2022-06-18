/**
 *  Using plane node to create our server instead of express.
 * helps to organise our code by seperating the server functionality from our express code.
 */
const http = require("http");
const PORT = 8000;
const { mongoConnect } = require("../src/services/mongo");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");
const server = http.createServer(app);

/**
 * Loading data on server start up.
 * This is useful concept in node when you intend on loading some services
 * before starting up your server.
 *  */
async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

startServer();
