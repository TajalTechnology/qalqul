import { readdirSync } from "fs";
import path from "path";

/* no stacktraces leaked to user */
module.exports = function (_app: {
    locals: { dirname: any; baseUri: any };
    use: (arg0: any, arg1: any) => void;
}) {
    const routes = path.join(_app.locals.dirname, "api");
    readdirSync(routes).forEach(function (_item: any) {
        _app.use(_app.locals.baseUri, require(path.join(routes, "index")));
    });
};
