const client = require("./db.js");
const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");

async function processCSVFile(filePath) {
  try {
    // Connects to the server
    await client.connect();

    // Collection that we are inserting into
    // Use Test collection to mess around with new data
    const collection = client
      .db("Baseball-Database")
      .collection("Pitcher-Data");

    // Temporary storage of data
    const tempData = [];

    // Changes CSV -> JSON and pushes it into tempData
    await csvtojson()
      .fromFile(filePath)
      .then((source) => {
        for (let i = 0; i < source.length; i++) {
          const oneRow = {
            player_name: source[i]["player_name"],
            Pitcher_Throwing_arm: source[i]["p_throws"],
            game_date: source[i]["game_date"],
            count: source[i]["balls"] + "-" + source[i]["strikes"],
            pitch_name: source[i]["pitch_name"],
            pitch_type: source[i]["pitch_type"],
            release_speed: source[i]["release_speed"],
            release_spin_rate: source[i]["release_spin_rate"],
            horizontal_pitch_movement: source[i]["pfx_x"],
            vertical_pitch_movement: source[i]["pfx_z"],
            description: source[i]["description"],
            zone: source[i]["zone"],
            plate_location_horizontal: source[i]["plate_x"],
            plate_location_vertical: source[i]["plate_z"],
          };
          tempData.push(oneRow);
        }
      });

    // Pushes data from tempData -> Collection
    await collection.insertMany(tempData);
    console.log(`Imported CSV ${filePath} into database successfully!`);
  } finally {
    // Closes connection to DB
    await client.close();
  }
}

async function run() {
  try {
    const folderPath = "./pitcher_data"; // Path to the folder containing CSV files

    // Read directory
    const files = fs.readdirSync(folderPath);

    // Process each CSV file
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      if (path.extname(filePath).toLowerCase() === ".csv") {
        await processCSVFile(filePath);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
