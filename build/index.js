"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const child_process_1 = require("child_process");
const call = (input, predefinedState) => {
    const args = ["test_run", ...input.args];
    const env = input.readSlots.reduce((environment, slot) => (Object.assign(Object.assign({}, environment), { [`DB_${slot}`]: predefinedState[slot] || "" })), {});
    const { stdout, stderr, status } = (0, child_process_1.spawnSync)(input.path, args, {
        env,
        encoding: "utf-8",
    });
    const state = Object.assign({}, predefinedState);
    const events = [];
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
    const result = {
        writes,
        state: stderr.length > 0 ? predefinedState : {},
        errorMessage: stderr,
        exitCode: status || 0,
    };
    return result;
};
exports.call = call;
