const client = require('./db.js')
const csvtojson = require('csvtojson') ;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // CSV file name
    const fileName = './data/sample.csv';
    var arrayToInsert = [];
    await csvtojson().fromFile(fileName).then(source => {
        // Fetching the all data from each row
        for (var i = 0; i < source.length; i++) {
            var oneRow = {
                firstName: source[i]['Firstname'],
                lastName: source[i]['Lastname'],
                city: source[i]['City'],
                salary: source[i]['Salary']
            };
            arrayToInsert.push(oneRow);
        }
        //inserting into the table “employees”
        var collectionName = 'Baseball-Collection';
        var collection = client.db().collection(collectionName);
        console.log(arrayToInsert)
        collection.insertOne([{name:"Grant"}])
        // collection.insertMany(arrayToInsert, (err, result) => {
        //     if (err) console.log(err);
        //     if(result){
        //         console.log('Import CSV into database successfully.');
        //     }
        // });
    });

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run()
