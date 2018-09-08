"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var LOGGER = log4js.getLogger("ModuleRegistry");
LOGGER.level = "info";
var DefaultModuleRegistry = /** @class */ (function () {
    function DefaultModuleRegistry() {
        this.modules = {};
    }
    DefaultModuleRegistry.prototype.update = function (name, moduleDef) {
        this.modules[name] = moduleDef;
        return { name: name, moduleDef: moduleDef };
    };
    DefaultModuleRegistry.prototype.unload = function (name) {
        var moduleDef = this.modules[name];
        this.modules[name] = undefined;
        return { name: name, moduleDef: moduleDef };
    };
    DefaultModuleRegistry.prototype.valid = function (name) {
        return this.modules[name] !== null && this.modules[name] !== undefined;
    };
    return DefaultModuleRegistry;
}());
exports.DefaultModuleRegistry = DefaultModuleRegistry;
