"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (stm, registry) {
    return function (module) {
        stm(module, {});
        var moduleDef = registry.unload(module);
        moduleDef.destroy();
    };
});
