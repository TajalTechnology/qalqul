const router = require("express").Router();

require("./user")(router);
require("./article")(router);
require("./comment")(router);
require("./like")(router);

module.exports = router;
