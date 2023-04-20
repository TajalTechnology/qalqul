let mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const logger = require("./logger")("mongoose");

mongoose.Promise.config({
    poolSize: 10,
    warnings: {
        wForgottenReturn: false,
    },
});

mongoose.connect(process.env.DB_URL, function (err: any, db: any) {
    if (err) {
        console.log(err);
        logger.error("Unable to connect to the database:", err);
    } else {
        console.log("Database connection stablished");
        logger.info("Database Connection has been established successfully.");
    }
});

module.exports = mongoose;
