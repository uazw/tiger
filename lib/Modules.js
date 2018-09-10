"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Trigger = /** @class */ (function () {
    function Trigger(name, moduleDef) {
        this.valid = true;
        this.name = name;
        this.moduleDef = moduleDef;
    }
    Trigger.prototype.handler = function (handler) {
        this._handler = handler;
    };
    Trigger.prototype.mountOn = function (fn) {
        fn(this.name, this._handler);
    };
    Trigger.prototype.destroy = function () {
        this.valid = false;
    };
    return Trigger;
}());
exports.Trigger = Trigger;
var Worker = /** @class */ (function () {
    function Worker(name, moduleDef) {
        this.valid = true;
        this._task = undefined;
        this.name = name;
        this.moduleDef = moduleDef;
    }
    Worker.prototype.task = function (task) {
        this._task = task;
        return this._task;
    };
    Worker.prototype.start = function () {
        if (this._task) {
            this._task.start();
        }
    };
    Worker.prototype.destroy = function () {
        if (this._task) {
            this._task.destroy();
        }
        this.valid = false;
    };
    return Worker;
}());
exports.Worker = Worker;
