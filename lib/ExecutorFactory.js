"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var LOGGER = log4js.getLogger("Executor");
LOGGER.level = "info";
exports.default = (function (path, module, stateManager, moduleRegistry) {
    return function (req, res) {
        if (!moduleRegistry.valid(module)) {
            res.status(404).send({ error: "module " + module + " no longer valid" });
            return;
        }
        var moduleDef = moduleRegistry.retrieve(module).moduleDef;
        var state = stateManager(module);
        LOGGER.info("Handle request on " + path);
        moduleDef.handler(req, res, state);
        LOGGER.info("Request " + path + " processed successfully");
        stateManager(module, state);
    };
});
