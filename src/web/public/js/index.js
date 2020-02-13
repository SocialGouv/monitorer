import Chart from "./components/Chart.js";
import ChartLengthButton from "./components/ChartLengthButton.js";
import Log from "./components/Log.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    [...document.querySelectorAll(".js-log")].forEach($node => new Log($node));
    [...document.querySelectorAll(".js-chart")].forEach($node => new Chart($node));
    [...document.querySelectorAll(".js-chartLengthButton")].forEach(
      $node => new ChartLengthButton($node),
    );
  } catch (err) {
    console.error(`[web] [public/js/index.js] Error: ${err.message}`);
  }
});
