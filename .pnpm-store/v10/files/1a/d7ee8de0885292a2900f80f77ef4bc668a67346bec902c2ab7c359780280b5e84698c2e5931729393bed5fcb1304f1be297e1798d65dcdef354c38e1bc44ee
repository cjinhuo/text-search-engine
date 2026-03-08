"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repair = repair;
const params_1 = require("../../utils/params");
const migrationsJson = require("../../../migrations.json");
const migrate_1 = require("../migrate/migrate");
const output_1 = require("../../utils/output");
async function repair(args, extraMigrations = []) {
    if (args['verbose']) {
        process.env.NX_VERBOSE_LOGGING = 'true';
    }
    const verbose = process.env.NX_VERBOSE_LOGGING === 'true';
    return (0, params_1.handleErrors)(verbose, async () => {
        const nxMigrations = Object.entries(migrationsJson.generators).reduce((agg, [name, migration]) => {
            const skip = migration['x-repair-skip'];
            if (!skip) {
                agg.push({
                    package: 'nx',
                    cli: 'nx',
                    name,
                    description: migration.description,
                    version: migration.version,
                });
            }
            return agg;
        }, []);
        const migrations = [...nxMigrations, ...extraMigrations];
        const migrationsThatMadeNoChanges = await (0, migrate_1.executeMigrations)(process.cwd(), migrations, verbose, false, '');
        if (migrationsThatMadeNoChanges.length < migrations.length) {
            output_1.output.success({
                title: `Successfully repaired your configuration. This workspace is up to date!`,
            });
        }
        else {
            output_1.output.success({
                title: `No changes were necessary. This workspace is up to date!`,
            });
        }
    });
}
