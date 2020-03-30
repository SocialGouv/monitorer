import configurationService from "../services/configuration.js";

/**
 * @typedef {object} ValidationError
 * @property {string} dataPath
 * @property {string} keyword
 * @property {string} message
 * @property {object} params
 * @property {string} schemaPath
 */

export default class Configuration {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      /** @type {HTMLElement} */
      this.$node = $node;

      this.$editor = $node.querySelector(".js-configuration-editor");
      this.$error = $node.querySelector(".js-configuration-error");
      this.$errorList = $node.querySelector(".js-configuration-errorList");
      this.$saveButton = $node.querySelector(".js-configuration-saveButton");

      /** @type {import("codemirror").Editor} */
      this.codeMirror = CodeMirror(
        $codeMirrorEditor => {
          this.$editor.parentNode.replaceChild($codeMirrorEditor, this.$editor);
        },
        {
          autocapitalize: false,
          autocorrect: false,
          extraKeys: {
            // Insert spaces instead of tabs when pressing "TAB":
            Tab: function (cm) {
              cm.replaceSelection(Array(cm.getOption("indentUnit") + 1).join(" "));
            },
          },
          indentUnit: 2,
          indentWithTabs: false,
          keyMap: "sublime",
          lineNumbers: true,
          mode: "yaml",
          selfContain: true,
          spellcheck: false,
          tabSize: 2,
          theme: "ayu-dark",
          value: this.$editor.value,
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
      this.$saveButton.addEventListener("click", this.save.bind(this));
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
      this.cleanErrors();
      this.$saveButton.disabled = true;
      this.$saveButton.innerText = "UPDATING…";

      const source = this.codeMirror.getValue();

      await configurationService.update(source);
    } catch (err) {
      if (Array.isArray(err)) {
        this.showErrors(err);
      } else {
        console.error(`[web] [public/js/components/Editor#save()] Error: ${err.message}`);
      }
    }

    this.$saveButton.innerText = "UPDATE";
    this.$saveButton.disabled = false;
  }

  /**
   * Clean and hide errors.
   *
   * @returns {void}
   */
  cleanErrors() {
    if (!this.$error.classList.contains("d-none")) {
      this.$error.classList.add("d-none");
    }

    this.$errorList.innerHTML = "";
  }

  /**
   * Display errors.
   *
   * @param {ValidationError[]} errors
   *
   * @returns {void}
   */
  showErrors(errors) {
    if (this.$error.classList.contains("d-none")) {
      this.$error.classList.remove("d-none");
    }

    errors.forEach(error => {
      const { dataPath, message } = error;

      const $error = document.createElement("li");
      $error.innerText = `${dataPath} ${message}.`.trim();
      this.$errorList.appendChild($error);
    });
  }
}
