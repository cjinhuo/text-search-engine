import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import fs from 'fs-extra';
import humanId from 'human-id';
import path from 'path';
import prettier from 'prettier';

function getPrettierInstance(cwd) {
  try {
    return require(require.resolve("prettier", {
      paths: [cwd]
    }));
  } catch (err) {
    if (!err || err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }

    return prettier;
  }
}

async function writeChangeset(changeset, cwd) {
  const {
    summary,
    releases
  } = changeset;
  const changesetBase = path.resolve(cwd, ".changeset"); // Worth understanding that the ID merely needs to be a unique hash to avoid git conflicts
  // experimenting with human readable ids to make finding changesets easier

  const changesetID = humanId({
    separator: "-",
    capitalize: false
  });
  const prettierInstance = getPrettierInstance(cwd);
  const newChangesetPath = path.resolve(changesetBase, `${changesetID}.md`); // NOTE: The quotation marks in here are really important even though they are
  // not spec for yaml. This is because package names can contain special
  // characters that will otherwise break the parsing step

  const changesetContents = `---
${releases.map(release => `"${release.name}": ${release.type}`).join("\n")}
---

${summary}
  `;
  await fs.outputFile(newChangesetPath, // Prettier v3 returns a promise
  await prettierInstance.format(changesetContents, _objectSpread(_objectSpread({}, await prettierInstance.resolveConfig(newChangesetPath)), {}, {
    parser: "markdown"
  })));
  return changesetID;
}

export { writeChangeset as default };
