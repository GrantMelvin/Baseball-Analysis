const client = require("./db.js");
const csvtojson = require("csvtojson");

async function run() {
  try {
    // Connects to the server
    await client.connect();

    // Collection that we are inserting into
    // Use Test collection to mess around with new data
    var collection = client.db("Baseball-Database").collection("Aaron-Nola");

    // Location of the data we want to insert
    const fileName = "./pitcher_data/aaron-nola.csv";

    // Temporary storage of data
    var tempData = [];

    // Changes CSV -> JSON and pushes it into tempData
    await csvtojson()
      .fromFile(fileName)
      .then((source) => {
        //change 1 to source.length to get all of the data
        for (var i = 0; i < source.length; i++) {
          var oneRow = {
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
  } finally {
    // Closes connection to DB
    console.log("Imported CSV into database successfully!");
    await client.close();
  }
}

run();
