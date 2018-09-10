"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var Modules_1 = require("./Modules");
var node_cron_1 = require("node-cron");
var LOGGER = log4js.getLogger("Worker");
LOGGER.level = "info";
exports.default = (function (module, workerDef, stm) {
    var worker = new Modules_1.Worker(module, workerDef);
    worker.task(node_cron_1.schedule(workerDef.cron, function () {
        var state = stm(module);
        LOGGER.info(module + " is running");
        worker.moduleDef.handler(state);
        LOGGER.info(module + " is done");
        stm(module, state);
    }));
    return worker;
});
