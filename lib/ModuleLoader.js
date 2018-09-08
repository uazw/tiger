"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var Executor_1 = require("./Executor");
var LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";
var DefaultModuleLoader = /** @class */ (function () {
    function DefaultModuleLoader(stateManager, loaderConfig, moduleRegistry, server) {
        this.stateManager = stateManager;
        this.loaderConfig = loaderConfig;
        this.moduleRegistry = moduleRegistry;
        this.server = server;
    }
    DefaultModuleLoader.prototype.load = function (module, force) {
        if (force === void 0) { force = false; }
        var path = "/modules/" + module;
        var status = true;
        try {
            var moduleDef = require(this.loaderConfig.basePath + "/" + module);
            this.moduleRegistry.update(module, moduleDef);
            if (force) {
                this.stateManager.set(module, moduleDef.state || {});
            }
            LOGGER.info("Mounting module on " + path);
            this.server[moduleDef.method](path, Executor_1.default(path, module, this.stateManager, this.moduleRegistry));
            LOGGER.info("Mounted module on " + path);
        }
        catch (e) {
            LOGGER.error("Error found when loading module " + module + ": " + e, e);
            status = false;
        }
        return { status: status, path: path };
    };
    DefaultModuleLoader.prototype.mount = function () {
        var _this = this;
        this.server.post("/loader", function (request, response) {
            var path = request.body.path;
            var force = request.params.force;
            LOGGER.info("Manually load modules " + path + " with force options?: " + force);
            var result = _this.load(path, force);
            response.send(result);
        });
    };
    return DefaultModuleLoader;
}());
exports.DefaultModuleLoader = DefaultModuleLoader;
