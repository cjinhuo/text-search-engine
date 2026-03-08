import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import * as fs from 'fs-extra';
import fs__default from 'fs-extra';
import path from 'path';
import parse from '@changesets/parse';
import * as git from '@changesets/git';
import chalk from 'chalk';
import pFilter from 'p-filter';
import { warn } from '@changesets/logger';

let importantSeparator = chalk.red("===============================IMPORTANT!===============================");
let importantEnd = chalk.red("----------------------------------------------------------------------");

async function getOldChangesets(changesetBase, dirs) {
  // this needs to support just not dealing with dirs that aren't set up properly
  let changesets = await pFilter(dirs, async (dir) => (await fs.lstat(path.join(changesetBase, dir))).isDirectory());
  const changesetContents = changesets.map(async changesetDir => {
    const jsonPath = path.join(changesetBase, changesetDir, "changes.json");
    const [summary, json] = await Promise.all([fs.readFile(path.join(changesetBase, changesetDir, "changes.md"), "utf-8"), fs.readJson(jsonPath)]);
    return {
      releases: json.releases,
      summary,
      id: changesetDir
    };
  });
  return Promise.all(changesetContents);
} // this function only exists while we wait for v1 changesets to be obsoleted
// and should be deleted before v3


async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);

  if (oldChangesets.length === 0) {
    return [];
  }

  warn(importantSeparator);
  warn("There were old changesets from version 1 found");
  warn("These are being applied now but the dependents graph may have changed");
  warn("Make sure you validate all your dependencies");
  warn("In a future major version, we will no longer apply these old changesets, and will instead throw here");
  warn(importantEnd);
  return oldChangesets;
}

async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newChangesets = await git.getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  });
  const newHashes = newChangesets.map(c => c.split("/")[1]);
  return changesets.filter(dir => newHashes.includes(dir));
}

async function getChangesets(cwd, sinceRef) {
  let changesetBase = path.join(cwd, ".changeset");
  let contents;

  try {
    contents = await fs__default.readdir(changesetBase);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("There is no .changeset directory in this project");
    }

    throw err;
  }

  if (sinceRef !== undefined) {
    contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef);
  }

  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  let changesets = contents.filter(file => !file.startsWith(".") && file.endsWith(".md") && file !== "README.md");
  const changesetContents = changesets.map(async file => {
    const changeset = await fs__default.readFile(path.join(changesetBase, file), "utf-8");
    return _objectSpread(_objectSpread({}, parse(changeset)), {}, {
      id: file.replace(".md", "")
    });
  });
  return [...(await oldChangesetsPromise), ...(await Promise.all(changesetContents))];
}

export { getChangesets as default };
