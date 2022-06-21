const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");

const habitualPlanets = [];
const isHabitualPlanets = (planet) => {
  return planet["koi_disposition"] == "CONFIRMED" && planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11 && planet["koi_prad"] < 1.6;
};

async function loadPlanetsData() {
  await fs
    .createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
    .pipe(
      parse({
        comment: "#",
        columns: true, // making it an object
      })
    )
    .on("data", async (data) => {
      if (isHabitualPlanets(data)) {
        await savePlanet(data);
      }
    })
    .on("error", (err) => console.log(err))
    .on("end", async () => {
      const countPlanetsFound = (await getAllPlanets()).length;
      // console.log(habitualPlanets.map((planet) => planet["kepler_name"]));
      console.log(`${countPlanetsFound} habitable planets found!`);
    });
}

async function getAllPlanets() {
  const hideFields = { _id: 0, __v: 0 };
  return await planets.find({}, hideFields);
}

async function savePlanet(planet) {
  // habitualPlanets.push(planet);
  try {
    await planets.updateOne({ keplerName: planet.kepler_name }, { keplerName: planet.kepler_name }, { upsert: true });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
