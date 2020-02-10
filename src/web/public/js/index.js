import LatencyChart from "./components/LatencyChart.js";
import UptimeChart from "./components/UptimeChart.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    [...document.querySelectorAll(".js-latencyChart")].forEach($node => new LatencyChart($node));
    [...document.querySelectorAll(".js-uptimeChart")].forEach($node => new UptimeChart($node));
  } catch (err) {
    console.error(`[web] [public/js/index.js] Error: ${err.message}`);
  }
});
