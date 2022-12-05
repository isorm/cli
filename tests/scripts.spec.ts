import "jest";
import cli from "../src/cli";
import { describe, it } from "@jest/globals";

describe("creates", () => {
  it("should to be run dev", async () => {
    cli.parse("dev", (err: any, argv: any, out: any) => {
      console.log(err);
      //   console.log(argv);
    });
  });
});
