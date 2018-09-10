"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var Modules_1 = require("./Modules");
var LOGGER = log4js.getLogger("Executor");
LOGGER.level = "info";
exports.default = (function (module, triggerDef, stm) {
    var trigger = new Modules_1.Trigger(module, triggerDef);
    trigger.handler(function (req, res) {
        if (!trigger.valid) {
            res.status(404).send({ error: "module " + module + " no longer valid" });
            return;
        }
        var state = stm(module);
        LOGGER.info("Handle request for " + module);
        trigger.moduleDef.handler(req, res, state);
        LOGGER.info("Request for " + module + " processed successfully");
        stm(module, state);
    });
    return trigger;
});
