import fs from "fs";
import { join } from "path";

const getTsConfigs = async (path: string) => {
  const config = join(path, "tsconfig.json");

  const file = await import(config);

  return file;
};

export default getTsConfigs;
