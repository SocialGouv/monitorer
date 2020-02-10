import Configuration from "./components/Configuration.js";
import Form from "./components/Form.js";
import Maintenance from "./components/Maintenance.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    const $configuration = document.querySelector(".js-configuration");
    if ($configuration !== null) new Configuration($configuration);

    const $form = document.querySelector(".js-form");
    if ($form !== null) new Form($form);

    const $maintenance = document.querySelector(".js-maintenance");
    if ($maintenance !== null) new Maintenance($maintenance);
  } catch (err) {
    console.error(`[web] [public/js/admin.js] Error: ${err.message}`);
  }
});
