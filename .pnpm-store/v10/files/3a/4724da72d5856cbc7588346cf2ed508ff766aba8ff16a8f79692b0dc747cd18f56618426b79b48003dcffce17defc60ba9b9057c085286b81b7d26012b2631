import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import * as fs from 'fs-extra';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';
import { PreExitButNotInPreModeError, PreEnterButInPreModeError } from '@changesets/errors';

async function readPreState(cwd) {
  let preStatePath = path.resolve(cwd, ".changeset", "pre.json"); // TODO: verify that the pre state isn't broken

  let preState;

  try {
    let contents = await fs.readFile(preStatePath, "utf8");

    try {
      preState = JSON.parse(contents);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error("error parsing json:", contents);
      }

      throw err;
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return preState;
}
async function exitPre(cwd) {
  let preStatePath = path.resolve(cwd, ".changeset", "pre.json"); // TODO: verify that the pre state isn't broken

  let preState = await readPreState(cwd);

  if (preState === undefined) {
    throw new PreExitButNotInPreModeError();
  }

  await fs.outputFile(preStatePath, JSON.stringify(_objectSpread(_objectSpread({}, preState), {}, {
    mode: "exit"
  }), null, 2) + "\n");
}
async function enterPre(cwd, tag) {
  var _preState$changesets;

  let packages = await getPackages(cwd);
  let preStatePath = path.resolve(packages.root.dir, ".changeset", "pre.json");
  let preState = await readPreState(packages.root.dir); // can't reenter if pre mode still exists, but we should allow exited pre mode to be reentered

  if ((preState === null || preState === void 0 ? void 0 : preState.mode) === "pre") {
    throw new PreEnterButInPreModeError();
  }

  let newPreState = {
    mode: "pre",
    tag,
    initialVersions: {},
    changesets: (_preState$changesets = preState === null || preState === void 0 ? void 0 : preState.changesets) !== null && _preState$changesets !== void 0 ? _preState$changesets : []
  };

  for (let pkg of packages.packages) {
    newPreState.initialVersions[pkg.packageJson.name] = pkg.packageJson.version;
  }

  await fs.outputFile(preStatePath, JSON.stringify(newPreState, null, 2) + "\n");
}

export { enterPre, exitPre, readPreState };
