import config from "config";
const port = config.get<number>("port");
import swaggerUI from "swagger-ui-express";
import utils from "../common/services/utils";
import swaggerDocument from "../app/common/utils/swagger.json";
import { accesssOrigin } from "../common/middlewares/accessOrigin";

/* ----------------------------------- */
/* Initializing Express App */
/* ----------------------------------- */
var appLocals = { baseUri: "/api/", dirname: __dirname };
export var app: any = utils.initApp(appLocals);

/* ----------------------------------- */
/* Loading pre-required local service */
/* ----------------------------------- */
app.use(accesssOrigin);
utils.localService("mongoose", app);
utils.middleware("body-parser", app);
utils.middleware("api-response", app);
utils.middleware("routes", app);
// utils.localService("logger", app);
utils.middleware("try-catch", app);

//api documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
