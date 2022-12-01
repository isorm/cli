import shell, { ExecOptions } from "shelljs";

const execSync = async (command: string, options?: ExecOptions) => {
  return await new Promise((res, rej) => {
    shell.exec(command, options || {}, (code, stdout, stderr) => {
      if (stderr) return rej(stderr);
      return res(stdout);
    });
  });
};

export default execSync;
