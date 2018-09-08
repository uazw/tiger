

import {State} from "./types"

const STATE: State = {} 

// todo: Replace with PouchDB
export default (key: string, value?: State): State => {
  if (value) {
    STATE[key] = value;
  }
  return STATE[key] || {}
}