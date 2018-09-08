"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var log4js = require("log4js");
var fs = require("fs");
var StateManager_1 = require("./StateManager");
var ModuleRegistry_1 = require("./ModuleRegistry");
var ModuleLoader_1 = require("./ModuleLoader");
var DEFAULT_SERVER_PORT = 9527;
var LOGGER = log4js.getLogger("TigerServer");
LOGGER.level = "info";
var TigerServer = /** @class */ (function () {
    function TigerServer(basePath) {
        this.loaderConfig = { basePath: "./" };
        LOGGER.info("Creating a new TigerServer instance");
        LOGGER.info("Served in path: " + basePath);
        this.server = express();
        this.stateManager = new StateManager_1.DefaultStateManager;
        this.moduleRegistry = new ModuleRegistry_1.DefaultModuleRegistry;
        this.stateManager.mount(this.server);
        this.loaderConfig.basePath = basePath;
        this.moduleLoader =
            new ModuleLoader_1.DefaultModuleLoader(this.stateManager, this.loaderConfig, this.moduleRegistry, this.server);
    }
    TigerServer.prototype.serve = function () {
        var _this = this;
        var basePath = this.loaderConfig.basePath;
        fs.readdir(basePath, function (err, files) {
            files.forEach(function (file) {
                LOGGER.info("Preload module: [" + file + "]");
                _this.moduleLoader.load(file);
            });
        });
        fs.watch(basePath, function (evt, file) {
            var fullPath = basePath + "/" + file;
            LOGGER.info("Event '" + evt + "' found on file '" + fullPath + "'");
            if (file.match(/.*\.js$/) && fs.existsSync(fullPath)) {
                LOGGER.info("Loading module " + file + " automatically");
                _this.moduleLoader.load(file);
            }
            else if (file.match(/.*\.js$/)) {
                LOGGER.info("Unload module " + file);
                _this.moduleRegistry.unload(file);
            }
        });
        this.server.listen(this.serverPort || DEFAULT_SERVER_PORT);
    };
    TigerServer.prototype.config = function (configurer) {
        configurer(this.server);
    };
    TigerServer.prototype.port = function (port) {
        this.serverPort = port;
    };
    return TigerServer;
}());
exports.default = TigerServer;
