"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var LOGGER = log4js.getLogger("Worker");
LOGGER.level = "info";
exports.default = (function (module, stm, registry) {
    return function () {
        var moduleDef = registry.retrieve(module).moduleDef;
        var state = stm(module);
        LOGGER.info(module + " is running");
        moduleDef.handler(state);
        LOGGER.info(module + " is done");
        stm(module, state);
    };
});
