/* no stacktraces leaked to user */
module.exports = function (_app: any) {
    var bodyParser = require("body-parser");
    _app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
    _app.use(bodyParser.json({ limit: "5mb" }));
};
