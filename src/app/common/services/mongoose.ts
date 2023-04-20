const path = require("path");
module.exports = {
    instance: false,
    init: function (_app: any) {
        var service = __filename.replace(__dirname, "").replace(".js", "");
        service = path
            .join("../../../common", "services", service)
            .replace(/\\/g, "/");
        return (this.instance = require(service));
    },
    get: function () {
        if (!this.instance) {
            throw new Error(
                "Trying to get mongoose service without initializing it."
            );
        }
        return this.instance;
    },
};
