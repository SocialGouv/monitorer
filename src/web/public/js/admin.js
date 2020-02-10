import Editor from "./components/Editor.js";
import Form from "./components/Form.js";
import Maintenance from "./components/Maintenance.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    const $editor = document.querySelector(".js-editor");
    if ($editor !== null) new Editor($editor);

    const $form = document.querySelector(".js-form");
    if ($form !== null) new Form($form);

    const $maintenance = document.querySelector(".js-maintenance");
    if ($maintenance !== null) new Maintenance($maintenance);
  } catch (err) {
    console.error(`[web] [public/js/admin.js] Error: ${err.message}`);
  }
});
