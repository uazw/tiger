import express = require("express");
declare const _default: (basePath: string, serverPort?: number | undefined, configurer?: ((express: express.Express) => void) | undefined) => () => void;
export default _default;
