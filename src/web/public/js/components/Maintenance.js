import checkpoint from "../services/checkpoint.js";

export default class Maintenance {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      /** @type {HTMLFormElement} */
      this.$node = $node;

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      [...this.$node.querySelectorAll(".js-maintenance-cleanButton")].forEach($cleanButton =>
        $cleanButton.addEventListener("click", this.clean.bind(this)),
      );
      [...this.$node.querySelectorAll(".js-maintenance-dropButton")].forEach($dropButton =>
        $dropButton.addEventListener("click", this.drop.bind(this)),
      );
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Check for an existing token stored in cookies.
   *
   * @param {MouseEvent} event
   *
   * @returns {Promise<void>}
   */
  async clean(event) {
    try {
      const { uri } = event.target.dataset;

      await checkpoint.delete(uri);

      location.reload();
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance#clean()] Error: ${err.message}`);
    }
  }

  /**
   * Check for an existing token stored in cookies.
   *
   * @param {MouseEvent} event
   *
   * @returns {Promise<void>}
   */
  async drop(event) {
    try {
      const { uri } = event.target.dataset;

      await checkpoint.delete(uri, Date.now());

      location.reload();
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance#drop()] Error: ${err.message}`);
    }
  }
}
