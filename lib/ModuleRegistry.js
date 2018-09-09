"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_cron_1 = require("node-cron");
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
var PullModuleRegistry = /** @class */ (function () {
    function PullModuleRegistry() {
        this.modules = {};
        this.workers = {};
    }
    PullModuleRegistry.prototype.update = function (name, moduleDef) {
        this.modules[name] = moduleDef;
        if (this.workers[name])
            this.workers[name].destroy();
        this.workers[name] = node_cron_1.schedule(moduleDef.cron, moduleDef.handler.bind({ state: moduleDef.state }));
        this.workers[name].start();
        return { name: name, moduleDef: moduleDef };
    };
    PullModuleRegistry.prototype.unload = function (name) {
        var moduleDef = this.modules[name];
        this.workers[name].destroy();
        delete this.modules[name];
        return { name: name, moduleDef: moduleDef };
    };
    PullModuleRegistry.prototype.valid = function (name) {
        return this.modules[name] !== null && this.modules[name] !== undefined;
    };
    PullModuleRegistry.prototype.retrieve = function (name) {
        var moduleDef = this.modules[name];
        return { name: name, moduleDef: moduleDef };
    };
    return PullModuleRegistry;
}());
exports.PullModuleRegistry = PullModuleRegistry;
