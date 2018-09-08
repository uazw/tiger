"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var log4js = require("log4js");
var fs = require("fs");
var LOGGER = log4js.getLogger("TigerServer");
LOGGER.level = "info";
var TigerServer = /** @class */ (function () {
    function TigerServer() {
        this.triggers = {};
        this.db = {};
        LOGGER.info("Creating a new TigerServer instance");
        this.server = express();
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
        // TODO: changed to fs.watch
        this.server.post("/loader", function (request, response) {
            var path = request.body.path;
            var result = _this.loadModules(basePath, path, request.params.force);
            response.send(result);
        });
        this.server.get("/state/:module", function (request, response) {
            response.send(_this.state(request.params["module"]));
        });
        this.server.listen(this.serverPort || 9527);
    };
    TigerServer.prototype.config = function (configurer) {
        configurer(this.server);
    };
    TigerServer.prototype.port = function (port) {
        this.serverPort = port;
    };
    TigerServer.prototype.state = function (moduleName, value) {
        if (value) {
            this.db[moduleName] = value;
        }
        return this.db[moduleName];
    };
    TigerServer.prototype.loadModules = function (basePath, path, force) {
        var _this = this;
        var status = true;
        var servedPath = "/modules/" + path;
        try {
            var mod_1 = require(basePath + "/" + path);
            this.triggers[servedPath] = mod_1;
            if (force || !this.state(path)) {
                this.state(path, mod_1.state || {});
            }
            this.server[mod_1.method](servedPath, function (request, response) {
                var state = _this.state(path);
                mod_1.handler(request, response, state);
                _this.state(path, state);
            });
        }
        catch (e) {
            status = false;
        }
        return { status: status, path: servedPath };
    };
    return TigerServer;
}());
function tiger(fn) {
    var tiger = new TigerServer();
    if (fn)
        fn(tiger);
    return tiger;
}
exports.tiger = tiger;
