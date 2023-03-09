import { spawnSync } from "child_process";

type State = {
  [key: string]: string;
};

interface IEnvironment {
  [key: string]: string;
}

type Primitive = string | number | boolean;

export interface IProgramInput {
  path: string;
  args: Primitive[];
  readSlots: string[];
}

export interface IProgramOutput {
  writes: number;
  state: State;
  events: string[];
  errorMessage: string;
  exitCode: number;
}

export const call = (
  input: IProgramInput,
  predefinedState: State
): IProgramOutput => {
  const args: Primitive[] = ["test_run", ...input.args];

  const env: IEnvironment = input.readSlots.reduce(
    (environment: IEnvironment, slot: string) => ({
      ...environment,
      [`DB_${slot}`]: predefinedState[slot] || "",
    }),
    {}
  );

  const { stdout, stderr, status } = spawnSync(input.path, args, {
    env,
    encoding: "utf-8",
  });

  const state: State = { ...predefinedState };
  const events: string[] = [];

  let writes = 0;

  for (const line of stdout.split("\n")) {
    // Writes
    if (line.startsWith("DBW")) {
      const [, key, value] = line.split("=");

      state[key] = value;

      writes++;
    }

    // Prunes
    else if (line.startsWith("DBP")) {
      const [, allKeys] = line.split("=");
      const keys = allKeys.split(",");

      for (const key of keys) {
        delete state[key];
      }
    }

    // Events
    else if (line.startsWith("OUT")) {
      events.push(line.split("=")[1]);
    }

    // Logs
    else {
      console.log(line);
    }
  }

  if (Buffer.byteLength(stderr || "", "utf8") > 32) {
    console.warn("Warning:", stderr, "error message is over 32 bytes.");
  }

  const result: IProgramOutput = {
    writes,
    state: stderr.length > 0 ? predefinedState : {},
    events,
    errorMessage: stderr,
    exitCode: status || 0,
  };

  return result;
};
