import { EVENT } from "../constants.js";

export default class ChartLengthButton {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      /** @type {HTMLFormElement} */
      this.$node = $node;

      this.event = new CustomEvent(EVENT.UPDATE_CHART_LENGTH, { detail: $node.dataset.value });

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/ChartLengthButton()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      this.$node.addEventListener("click", this.onClick.bind(this));
    } catch (err) {
      console.error(
        `[web] [public/js/components/ChartLengthButton#bindEvents()] Error: ${err.message}`,
      );
    }
  }

  /**
   * Check for an existing token stored in cookies.
   *
   * @returns {void}
   */
  onClick() {
    try {
      document.dispatchEvent(this.event);

      document.querySelector(".js-chartLengthButton.active").classList.remove("active");
      this.$node.classList.add("active");
    } catch (err) {
      console.error(
        `[web] [public/js/components/ChartLengthButton#onClick()] Error: ${err.message}`,
      );
    }
  }
}
