import Dashboard from "./blocks/Dashboard.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    const metas = {
      serviceUris: JSON.parse(document.querySelector(`meta[name="service-uris"]`).content),
    };

    new Dashboard(document.querySelector(".js-dashboard"), metas);
  } catch (err) {
    console.error(`[web] [public/js/index.js] Error: ${err.message}`);
  }
});
