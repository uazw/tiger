
import TriggerFactory from "./TriggerFactory"
import stm from "./StateManager"

import {expect} from "chai"
import { TriggerDef, Request, Response } from "./types";

class MockedResponse {
  _status?: number;
  _body?: { error: string }

  status(_status: number): MockedResponse {
    this._status = _status;
    return this;
  }

  send(_body: {error: string}): MockedResponse {
    this._body = _body;
    return this;
  }
}

describe("TriggerFactory", () => {
  it("should be able to create a trigger", () => {

    let tdf: TriggerDef = {
      method: "get",
      state: { count: 0 },
      handler: (req, res, st) => { if(st) st.count ++; st}
    }

    let trigger = TriggerFactory("trigger", tdf, stm);

    trigger.mountOn((name, handler) => {
      expect(name).eql("trigger");
      handler(<Request>{}, <Response>{})
      expect(stm("trigger").count).eql(1);
    });
  });

  it("should be able to handle error when trigger is invalid", () => {
    
    let res = new MockedResponse();

    let tdf: TriggerDef = {
      method: "get",
      handler: (req, res, st) => st
    }

    let trigger = TriggerFactory("trigger", tdf, stm);
    trigger.valid = false;

    trigger.mountOn((name, handler) => {
      expect(name).eql("trigger");
      handler(<Request>{}, <Response>res);

      expect(res._status).eq(404)
      expect(res._body).include.keys("error")
    });
  });

  it("should only update the state when trigger runs successfully", () => {
    let tdf: TriggerDef = {
      method: "get",
      state: { count: 0 },
      handler: (req, res, st) => { if(st) st.count ++; throw new Error("Error occured"); }
    }

    let trigger = TriggerFactory("trigger", tdf, stm);

    trigger.mountOn((name, handler) => {
      expect(name).eql("trigger");
      handler(<Request>{}, <Response>{})
      expect(stm("trigger").count).eql(0);
    });
  });
});