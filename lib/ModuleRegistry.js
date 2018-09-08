"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        delete this.modules[name];
        return { name: name, moduleDef: moduleDef };
    };
    DefaultModuleRegistry.prototype.valid = function (name) {
        return this.modules[name] !== null && this.modules[name] !== undefined;
    };
    DefaultModuleRegistry.prototype.retrieve = function (name) {
        var moduleDef = this.modules[name];
        return { name: name, moduleDef: moduleDef };
    };
    return DefaultModuleRegistry;
}());
exports.DefaultModuleRegistry = DefaultModuleRegistry;
