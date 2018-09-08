
import TigerServer from "./TigerServer"

import * as types from "./types"

export interface Tiger extends types.Tiger {}
export type TigerMethod = types.TigerMethod;
export type TigerModule = types.TigerModule;

export interface State extends types.State {}

export function tiger(fn?: (tiger: Tiger) => void): Tiger {
  let tiger = new TigerServer();
  if (fn) fn(tiger);
  return tiger;
}
