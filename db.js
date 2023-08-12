const { MongoClient } = require("mongodb");
require('dotenv').config()

const uri = process.env.MONGODB_URI;
const dbName = process.env.DBNAME;

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbName);
  return db;
}

module.exports = { connectToMongoDB };
