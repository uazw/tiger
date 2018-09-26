
import stm from "./StateManager";


import "mocha"
import {expect} from "chai"


describe("StateManager", () => {
  it("shuold save state", () => {
    stm("hello", { value: 123 });
    expect(stm("hello").value).eq(123);
  });


  it("should return empty object", () => {
    
    expect(stm("another")).eql({})
  });
})
