import Dashboard from "./blocks/Dashboard.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    new Dashboard(document.querySelector(".js-dashboard"));
  } catch (err) {
    console.error(`[web] [public/js/index.js] Error: ${err.message}`);
  }
});
