const client = require('./db.js')
const csvtojson = require('csvtojson') ;

async function run() {
  try {                                                     // Connects to the server
    await client.connect();

    // Collection that we are inserting into
    var collection = client.db('Baseball-Database').collection('Baseball-Collection');

    // Location of the data we want to insert
    const fileName = './pitcher_data/aaron-nola.csv';

    // Temporary storage of data
    var tempData = [];
    
    // Changes CSV -> JSON and pushes it into tempData
    await csvtojson().fromFile(fileName).then(source => {
        for (var i = 0; i < 1; i++) {
            var oneRow = {
                pitch_type: source[i]['pitch_type'],
                release_speed: source[i]['release_speed'],
                zone: source[i]['zone'],
                release_spin_rate: source[i]['release_spin_rate']
            };
            tempData.push(oneRow);
        }
    })

    // Pushes data from tempData -> Collection
    await collection.insertMany(tempData)
    }finally {                                              // Closes connection to DB
        console.log('Imported CSV into database successfully!');
        await client.close();
    }
}

run()
