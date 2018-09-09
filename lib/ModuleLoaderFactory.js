"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var log4js = require("log4js");
var node_cron_1 = require("node-cron");
var ExecutorFactory_1 = require("./ExecutorFactory");
var WorkerFactory_1 = require("./WorkerFactory");
var LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";
exports.default = (function (stm, cfg, registry, server) {
    LOGGER.info("Creating new module loader");
    return function (module, force) {
        if (force === void 0) { force = false; }
        var path = "/modules/" + module;
        var status = true;
        try {
            var moduleDef = require(cfg.basePath + "/" + module);
            registry.update(module, moduleDef);
            if (force) {
                stm(module, moduleDef.state || {});
            }
            if (types_1.isTigerModuleDef(moduleDef)) {
                LOGGER.info("Mounting module on " + path);
                server[moduleDef.method](path, ExecutorFactory_1.default(path, module, stm, registry));
                LOGGER.info("Mounted module on " + path);
            }
            else {
                LOGGER.info("Mounting a scheduled worker on " + path);
                moduleDef._worker = node_cron_1.schedule(moduleDef.cron, WorkerFactory_1.default(module, stm, registry));
                moduleDef._worker.start();
                LOGGER.info("Mounted a scheduled worker on " + path);
            }
        }
        catch (e) {
            LOGGER.error("Error found when loading module " + module + ": " + e, e);
            status = false;
        }
        return { status: status, path: path };
    };
});
