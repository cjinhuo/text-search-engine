import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import readChangesets from '@changesets/read';
import { read } from '@changesets/config';
import { getPackages } from '@manypkg/get-packages';
import { readPreState } from '@changesets/pre';

async function getReleasePlan(cwd, sinceRef, passedConfig) {
  const packages = await getPackages(cwd);
  const preState = await readPreState(cwd);
  const readConfig = await read(cwd, packages);
  const config = passedConfig ? _objectSpread(_objectSpread({}, readConfig), passedConfig) : readConfig;
  const changesets = await readChangesets(cwd, sinceRef);
  return assembleReleasePlan(changesets, packages, config, preState);
}

export { getReleasePlan as default };
