
import TigerServer from "./TigerServer"

import * as types from "./types"

export interface Tiger extends types.Tiger {}
export type TigerMethod = types.TigerMethod;
export type TigerModule = types.TigerModuleDef;

export interface State extends types.State {}

export function tiger(basePath: string, fn?: (tiger: Tiger) => void): Tiger {
  let tiger = new TigerServer(basePath);
  if (fn) fn(tiger);
  return tiger;
}
