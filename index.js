const client = require("./db.js");
const csvtojson = require("csvtojson");

async function run() {
  try {
    // Connects to the server
    await client.connect();

    // Collection that we are inserting into
    // Use Test collection to mess around with new data
    var collection = client
      .db("Baseball-Database")
      .collection("Baseball-Collection");

    // Location of the data we want to insert
    const fileName = "./pitcher_data/aaron-nola.csv";

    // Temporary storage of data
    var tempData = [];

    // Changes CSV -> JSON and pushes it into tempData
    await csvtojson()
      .fromFile(fileName)
      .then((source) => {
        //change 1 to source.length to get all of the data
        for (var i = 0; i < 1; i++) {
          var oneRow = {
            player_name: source[i]["player_name"],
            game_date: source[i]["game_date"],
            pitch_name: source[i]["pitch_name"],
            pitch_type: source[i]["pitch_type"],
            release_speed: source[i]["release_speed"],
            release_spin_rate: source[i]["release_spin_rate"],
            description: source[i]["description"],
            zone: source[i]["zone"],
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
