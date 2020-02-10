import Editor from "./components/Editor.js";
import Form from "./components/Form.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  try {
    const $editor = document.querySelector(".js-editor");
    if ($editor !== null) new Editor($editor);

    const $form = document.querySelector(".js-form");
    if ($form !== null) new Form($form);
  } catch (err) {
    console.error(`[web] [public/js/admin.js] Error: ${err.message}`);
  }
});
