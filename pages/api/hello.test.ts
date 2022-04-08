import { sum } from "./hello";

describe("a test", () => {
  it("should pass", () => {
    expect(sum(1, 2)).toStrictEqual(3);
  });
  it("should fail", () => {
    expect(sum(1, 2)).toStrictEqual(4);
  });
});
