const client = require('./db.js')
const csvtojson = require('csvtojson') ;

async function run() {
  try {                                                     // Connects to the server
    await client.connect();

    // Collection that we are inserting into
    var collection = client.db('Baseball-Database').collection('Baseball-Collection');

    // Location of the data we want to insert
    const fileName = './data/sample.csv';

    // Temporary storage of data
    var tempData = [];
    
    // Changes CSV -> JSON and pushes it into tempData
    await csvtojson().fromFile(fileName).then(source => {
        for (var i = 0; i < source.length; i++) {
            var oneRow = {
                firstName: source[i]['Firstname'],
                lastName: source[i]['Lastname'],
                city: source[i]['City'],
                salary: source[i]['Salary']
            };
            tempData.push(oneRow);
        }
    })

    // Pushes data from tempData -> Collection
    await collection.insertMany(tempData, (err, result) => {
        if (err) console.log(err);
        if(result){
            console.log('Import CSV into database successfully.');
        }
    })
    }finally {                                              // Closes connection to DB

    await client.close();
  }
}

run()
