
import TigerServer from "./TigerServer"

import * as types from "./types"

export interface Tiger extends types.Tiger {}
export type TigerMethod = types.TigerMethod;

export type TriggerDef = types.TriggerDef;
export type WorkerDef = types.WorkerDef;

export interface State extends types.State {}

export const tiger = TigerServer;