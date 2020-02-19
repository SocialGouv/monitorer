const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
require("colors");

const { version: VERSION } = require("../../package");
const DOCS_HEROKU_PATH = path.join(__dirname, "../../docs/deployment-heroku.md");
const README_PATH = path.join(__dirname, "../../README.md");

/**
 * Run a command in the shell.
 *
 * @param {string} command
 */
function run(command) {
  shelljs.echo(`Running: \`${command}\`…`.blue);
  const output = shelljs.exec(command);
  if (output.code !== 0) shelljs.exit(1);
}

/* eslint-disable */
const DOCS_HEROKU_PATCH = `
<!-- CI_START -->

[link-heroku]: https://heroku.com/deploy?template=https://github.com/SocialGouv/monitorer/tree/v${VERSION}

<!-- CI_END -->
`.trim();

const README_PATCH = `
<!-- CI_START -->

[link-heroku]: https://heroku.com/deploy?template=https://github.com/SocialGouv/monitorer/tree/v${VERSION}

<!-- CI_END -->
`.trim();
/* eslint-enable */

(() => {
  try {
    run(`git checkout -B v${VERSION}`);

    // docs/heroku.md
    const docsHerokuSource = fs.readFileSync(DOCS_HEROKU_PATH, "utf8");
    const newDocsHerokuSource = docsHerokuSource.replace(
      /<!-- CI_START.*CI_END -->/s,
      DOCS_HEROKU_PATCH,
    );
    fs.writeFileSync(README_PATH, newDocsHerokuSource);

    // REAME.md
    const readmeSource = fs.readFileSync(README_PATH, "utf8");
    const newReadmeSource = readmeSource.replace(/<!-- CI_START.*CI_END -->/s, README_PATCH);
    fs.writeFileSync(README_PATH, newReadmeSource);

    run(`git add .`);
  } catch (err) {
    shelljs.echo(`[scripts/ci/release.js] Error: ${err.message}`.red);

    shelljs.exit(1);
  }
})();
