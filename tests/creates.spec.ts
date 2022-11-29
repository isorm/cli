import "jest";
import cli from "../src/cli";
import { describe, it } from "@jest/globals";

describe("creates", () => {
  it("should create new app", async () => {
    cli.parse("create app", (err: any, argv: any, out: any) => {
      console.log(err);
      //   console.log(argv);
    });
  });
});
