var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const low = require("lowdb");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
const models = require('./models/movie');
const data = require('./movies.json');
const assert = require('assert');

const adapter = new FileSync("db.json");
const db = low(adapter);
db._.mixin(lodashId);
db.defaults({ products: [] });


async function main(){

    const dotenv = require('dotenv');
    dotenv.config();
    const dbURI = process.env.DB_URL;

    const client = new MongoClient(dbURI);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        
        const results = await models.loadData(data);
        assert.equal(data.length, results.insertedCount);
        
        
        // Make the appropriate DB calls
        await  listDatabases(client);
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

var apiRouter = require("./routes/api")(db);
var clientRouter = require("./routes/client");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(clientRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send();
});

module.exports = app;
