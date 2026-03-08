"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsObject = exports.parserConfiguration = void 0;
const chalk = require("chalk");
const yargs = require("yargs");
const command_object_1 = require("./affected/command-object");
const command_object_2 = require("./connect/command-object");
const command_object_3 = require("./daemon/command-object");
const command_object_4 = require("./graph/command-object");
const command_object_5 = require("./exec/command-object");
const command_object_6 = require("./format/command-object");
const command_object_7 = require("./generate/command-object");
const command_object_8 = require("./init/command-object");
const command_object_9 = require("./list/command-object");
const command_object_10 = require("./migrate/command-object");
const command_object_11 = require("./new/command-object");
const command_object_12 = require("./repair/command-object");
const command_object_13 = require("./report/command-object");
const command_object_14 = require("./run/command-object");
const command_object_15 = require("./run-many/command-object");
const command_object_16 = require("./show/command-object");
const command_object_17 = require("./watch/command-object");
const command_object_18 = require("./reset/command-object");
const command_object_19 = require("./release/command-object");
const command_object_20 = require("./add/command-object");
const command_objects_1 = require("./deprecated/command-objects");
// Ensure that the output takes up the available width of the terminal.
yargs.wrap(yargs.terminalWidth());
exports.parserConfiguration = {
    'strip-dashed': true,
};
/**
 * Exposing the Yargs commands object so the documentation generator can
 * parse it. The CLI will consume it and call the `.argv` to bootstrapped
 * the CLI. These command declarations needs to be in a different file
 * from the `.argv` call, so the object and it's relative scripts can
 * le executed correctly.
 */
exports.commandsObject = yargs
    .parserConfiguration(exports.parserConfiguration)
    .usage(chalk.bold('Smart Monorepos · Fast CI'))
    .demandCommand(1, '')
    .command(command_object_20.yargsAddCommand)
    .command(command_object_1.yargsAffectedBuildCommand)
    .command(command_object_1.yargsAffectedCommand)
    .command(command_object_1.yargsAffectedE2ECommand)
    .command(command_object_1.yargsAffectedLintCommand)
    .command(command_object_1.yargsAffectedTestCommand)
    .command(command_objects_1.yargsAffectedGraphCommand)
    .command(command_object_2.yargsConnectCommand)
    .command(command_object_3.yargsDaemonCommand)
    .command(command_object_4.yargsGraphCommand)
    .command(command_object_5.yargsExecCommand)
    .command(command_object_6.yargsFormatCheckCommand)
    .command(command_object_6.yargsFormatWriteCommand)
    .command(command_object_7.yargsGenerateCommand)
    .command(command_object_8.yargsInitCommand)
    .command(command_object_10.yargsInternalMigrateCommand)
    .command(command_object_9.yargsListCommand)
    .command(command_object_10.yargsMigrateCommand)
    .command(command_object_11.yargsNewCommand)
    .command(command_objects_1.yargsPrintAffectedCommand)
    .command(command_object_19.yargsReleaseCommand)
    .command(command_object_12.yargsRepairCommand)
    .command(command_object_13.yargsReportCommand)
    .command(command_object_18.yargsResetCommand)
    .command(command_object_14.yargsRunCommand)
    .command(command_object_15.yargsRunManyCommand)
    .command(command_object_16.yargsShowCommand)
    .command(command_object_2.yargsViewLogsCommand)
    .command(command_object_17.yargsWatchCommand)
    .command(command_object_14.yargsNxInfixCommand)
    .scriptName('nx')
    .help()
    // NOTE: we handle --version in nx.ts, this just tells yargs that the option exists
    // so that it shows up in help. The default yargs implementation of --version is not
    // hit, as the implementation in nx.ts is hit first and calls process.exit(0).
    .version();
