import * as types from "./types";
export interface Tiger extends types.Tiger {
}
export declare type TigerMethod = types.TigerMethod;
export declare type TigerModule = types.TigerModule;
export interface State extends types.State {
}
export declare function tiger(fn?: (tiger: Tiger) => void): Tiger;
