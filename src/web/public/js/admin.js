import Editor from "./components/Editor.js";
import waitForInitializationAndRun from "./libs/waitForInitializationAndRun.js";

waitForInitializationAndRun(() => {
  new Editor(document.querySelector(".js-editor"));
});
