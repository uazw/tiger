"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
exports.default = (function (stm, registry) {
    return function (module) {
        stm(module, {});
        var moduleDef = registry.retrieve(module).moduleDef;
        if (types_1.isTigerModuleDef(moduleDef)) {
        }
        else {
            if (moduleDef._worker)
                moduleDef._worker.destroy();
        }
        registry.unload(module);
    };
});
