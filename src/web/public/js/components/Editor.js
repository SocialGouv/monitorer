import configuration from "../services/configuration.js";

export default class Editor {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
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
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    // TODO Debounce the configuration update.
    this.codeMirror.on("change", this.updateConfiguration.bind(this));
  }

  /**
   * Update the configuration via the API.
   *
   * @returns {void}
   */
  async updateConfiguration() {
    const source = this.codeMirror.getValue();

    try {
      await configuration.update(source);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
}
