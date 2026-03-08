"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yargsRepairCommand = void 0;
const documentation_1 = require("../yargs-utils/documentation");
exports.yargsRepairCommand = {
    command: 'repair',
    describe: `Repair any configuration that is no longer supported by Nx.

    Specifically, this will run every migration within the \`nx\` package
    against the current repository. Doing so should fix any configuration
    details left behind if the repository was previously updated to a new
    Nx version without using \`nx migrate\`.

    If your repository has only ever updated to newer versions of Nx with
    \`nx migrate\`, running \`nx repair\` should do nothing.
  `,
    builder: (yargs) => (0, documentation_1.linkToNxDevAndExamples)(yargs, 'repair').option('verbose', {
        type: 'boolean',
        describe: 'Prints additional information about the commands (e.g., stack traces)',
    }),
    handler: async (args) => process.exit(await (await Promise.resolve().then(() => require('./repair'))).repair(args)),
};
