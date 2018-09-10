"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var log4js = require("log4js");
var TriggerFactory_1 = require("./TriggerFactory");
var WorkerFactory_1 = require("./WorkerFactory");
var LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";
exports.default = (function (stm, cfg, registry, server) {
    LOGGER.info("Creating new module loader");
    return function (module) {
        var status = true;
        try {
            var moduleDef = require(cfg.basePath + "/" + module);
            LOGGER.info("Mounting a module as " + module);
            if (types_1.isTigerModuleDef(moduleDef)) {
                var trigger_1 = registry.update(module, TriggerFactory_1.default(module, moduleDef, stm));
                trigger_1.mountOn(function (n, h) { return server[trigger_1.moduleDef.method]("/modules/" + n, h); });
            }
            else {
                var worker = registry.update(module, WorkerFactory_1.default(module, moduleDef, stm));
                worker.start();
            }
            LOGGER.info("Mounted a module as " + module);
        }
        catch (e) {
            LOGGER.error("Error found when loading module " + module + ": " + e, e);
            status = false;
        }
        return { status: status, module: module };
    };
});
