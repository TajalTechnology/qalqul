const router = require("express").Router();

require("./user")(router);
require("./category")(router);
require("./article")(router);
require("./comment")(router);

module.exports = router;
