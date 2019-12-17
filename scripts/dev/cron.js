const log = require("@inspired-beings/log");
const cron = require("cron");

const job = require("../../src/job");

async function runJob() {
  log.info(`[job] Starting…`);

  await job();
}

new cron.CronJob("0 * * * * *", runJob, null, true, "America/Los_Angeles");
