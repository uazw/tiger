"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// todo: Replace with PouchDB
var DefaultStateManager = /** @class */ (function () {
    function DefaultStateManager() {
        this.state = {};
    }
    DefaultStateManager.prototype.set = function (key, value) {
        this.state[key] = value;
        return this.state[key];
    };
    DefaultStateManager.prototype.get = function (key) {
        return this.state[key] || {};
    };
    DefaultStateManager.prototype.mount = function (server) {
        var _this = this;
        server.get("/state/:module", function (req, res) {
            var module = req.params.module;
            res.send(_this.get(module));
        });
        server.put("/state/:module", function (req, res) {
            var module = req.params.module;
            res.send(_this.set(module, req.body));
        });
    };
    return DefaultStateManager;
}());
exports.DefaultStateManager = DefaultStateManager;
