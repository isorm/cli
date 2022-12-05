import fs from "fs";
import { join } from "path";

const getConfigs = async (path: string) => {
  const config = join(path, "isorm.config.js");
  if (!fs.existsSync(config)) return {};

  const file = await import(config);

  return file.default;
};

export default getConfigs;
