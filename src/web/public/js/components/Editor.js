import configuration from "../services/configuration.js";

export default class Editor {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      /** @type {import("codemirror").Editor} */
      this.codeMirror = CodeMirror(
        $codeMirrorEditor => {
          $node.parentNode.replaceChild($codeMirrorEditor, $node);
        },
        {
          lineNumbers: true,
          mode: "yaml",
          theme: "ayu-dark",
          value: $node.value,
        },
      );

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/Editor()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      // TODO Debounce the configuration update.
      this.codeMirror.on("change", this.save.bind(this));
    } catch (err) {
      console.error(`[web] [public/js/components/Editor#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update the configuration via the API.
   *
   * @returns {void}
   */
  async save() {
    try {
      const source = this.codeMirror.getValue();

      await configuration.update(source);
    } catch (err) {
      console.error(`[web] [public/js/components/Editor#save()] Error: ${err.message}`);
    }
  }
}
