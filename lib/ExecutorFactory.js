"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var LOGGER = log4js.getLogger("Executor");
LOGGER.level = "info";
exports.default = (function (path, module, stm, registry) {
    return function (req, res) {
        if (!registry.valid(module)) {
            res.status(404).send({ error: "module " + module + " no longer valid" });
            return;
        }
        var moduleDef = registry.retrieve(module).moduleDef;
        var state = stm(module);
        LOGGER.info("Handle request on " + path);
        moduleDef.handler(req, res, state);
        LOGGER.info("Request " + path + " processed successfully");
        stm(module, state);
    };
});
