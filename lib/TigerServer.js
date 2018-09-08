"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var log4js = require("log4js");
var fs = require("fs");
var StateManager_1 = require("./StateManager");
var ModuleRegistry_1 = require("./ModuleRegistry");
var DEFAULT_SERVER_PORT = 9527;
var LOGGER = log4js.getLogger("TigerServer");
LOGGER.level = "info";
var TigerServer = /** @class */ (function () {
    function TigerServer() {
        LOGGER.info("Creating a new TigerServer instance");
        this.server = express();
        this.stateManager = new StateManager_1.DefaultStateManager;
        this.moduleRegistry = new ModuleRegistry_1.DefaultModuleRegistry;
        this.stateManager.mount(this.server);
    }
    TigerServer.prototype.serve = function (basePath) {
        var _this = this;
        LOGGER.info("Served in path: " + basePath);
        fs.readdir(basePath, function (err, files) {
            files.forEach(function (file) {
                LOGGER.info("Preload module: [" + file + "]");
                _this.loadModules(basePath, file);
            });
        });
        fs.watch(basePath, function (evt, file) {
            var fullPath = basePath + "/" + file;
            LOGGER.info("Event '" + evt + "' found on file '" + fullPath + "'");
            if (file.match(/.*\.js$/) && fs.existsSync(fullPath)) {
                LOGGER.info("Loading module " + file + " automatically");
                _this.loadModules(basePath, file);
            }
            else if (file.match(/.*\.js$/)) {
                LOGGER.info("Unload module " + file);
                _this.moduleRegistry.unload(file);
            }
        });
        this.server.post("/loader", function (request, response) {
            var path = request.body.path;
            var force = request.params.force;
            LOGGER.info("Manually load modules " + path + " with force options?: " + force);
            var result = _this.loadModules(basePath, path, force);
            response.send(result);
        });
        this.server.listen(this.serverPort || DEFAULT_SERVER_PORT);
    };
    TigerServer.prototype.config = function (configurer) {
        configurer(this.server);
    };
    TigerServer.prototype.port = function (port) {
        this.serverPort = port;
    };
    TigerServer.prototype.state = function (moduleName, value) {
        if (value) {
            return this.stateManager.set(moduleName, value);
        }
        return this.stateManager.get(moduleName);
    };
    TigerServer.prototype.loadModules = function (basePath, module, force) {
        var _this = this;
        var status = true;
        var servedPath = "/modules/" + module;
        try {
            var mod_1 = require(basePath + "/" + module);
            this.moduleRegistry.update(module, mod_1);
            if (force || !this.state(module)) {
                this.state(module, mod_1.state || {});
            }
            LOGGER.info("Mounting module on " + servedPath);
            this.server[mod_1.method](servedPath, function (request, response) {
                if (!_this.moduleRegistry.valid(module)) {
                    response.status(404).send({ error: "module " + module + " no longer valid" });
                    return;
                }
                var state = _this.state(module);
                LOGGER.info("Handle request on " + servedPath);
                mod_1.handler(request, response, state);
                LOGGER.info("Request " + servedPath + " processed successfully");
                _this.state(module, state);
            });
        }
        catch (e) {
            LOGGER.error("Error found when loading module " + module + ": " + e, e);
            status = false;
        }
        return { status: status, path: servedPath };
    };
    return TigerServer;
}());
exports.default = TigerServer;
