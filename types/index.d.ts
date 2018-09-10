/// <reference types="express" />
import * as types from "./types";
export interface Tiger extends types.Tiger {
}
export declare type TigerMethod = types.TigerMethod;
export declare type TigerModule = types.TigerModuleDef;
export interface State extends types.State {
}
export declare const tiger: (basePath: string, serverPort?: number | undefined, configurer?: ((express: import("express").Express) => void) | undefined) => () => void;
