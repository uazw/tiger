"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var log4js = require("log4js");
var fs = require("fs");
var StateManager_1 = require("./StateManager");
var ModuleRegistry_1 = require("./ModuleRegistry");
var ModuleLoaderFactory_1 = require("./ModuleLoaderFactory");
var DEFAULT_SERVER_PORT = 9527;
var LOGGER = log4js.getLogger("TigerServer");
LOGGER.level = "info";
exports.default = (function (basePath, serverPort, configurer) {
    LOGGER.info("Creating a new TigerServer instance");
    LOGGER.info("Served in path: " + basePath);
    var server = express();
    var registry = new ModuleRegistry_1.DefaultModuleRegistry;
    var cfg = { basePath: basePath };
    var moduleLoader = ModuleLoaderFactory_1.default(StateManager_1.default, cfg, registry, server);
    if (configurer)
        configurer(server);
    fs.readdir(basePath, function (err, files) {
        files.forEach(function (file) {
            LOGGER.info("Preload module: [" + file + "]");
            moduleLoader(file);
        });
    });
    return function () {
        fs.watch(basePath, function (evt, file) {
            var fullPath = basePath + "/" + file;
            LOGGER.info("Event '" + evt + "' found on file '" + fullPath + "'");
            if (file.match(/.*\.js$/) && fs.existsSync(fullPath)) {
                LOGGER.info("Loading module " + file + " automatically");
                moduleLoader(file);
            }
            else if (file.match(/.*\.js$/)) {
                LOGGER.info("Unload module " + file);
                registry.unload(file);
            }
        });
        server.listen(serverPort || DEFAULT_SERVER_PORT);
    };
});
