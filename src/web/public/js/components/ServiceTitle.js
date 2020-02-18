import { EVENT } from "../constants.js";
import checkpointService from "../services/checkpoint.js";

export default class ServiceTitle {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      this.$label = $node.querySelector(".js-serviceTitle-badge");

      /** @type {boolean | null} */
      this.isUp = null;
      /** @type {string} */
      this.uri = $node.dataset.uri;

      this.update = this.update.bind(this);

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceTitle()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      document.addEventListener(EVENT.UPDATE_CHECKPOINTS, this.update);
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceTitle#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update title.
   *
   * @param {Event} event
   *
   * @returns {Promise<void>}
   */
  async update(event) {
    try {
      const detail = { ...event.detail };
      const { uri } = detail;

      // Skip if it's not for this uri:
      if (uri !== this.uri) return;

      const latestCheckpoint = await checkpointService.latest(this.uri);
      this.isUp = latestCheckpoint.latency > 0;

      this.render();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceTitle#update()] Error: ${err.message}`);
    }
  }

  /**
   * Render chart.
   *
   * @returns {void}
   */
  render() {
    try {
      this.$label.classList.remove("badge-danger", "badge-success");

      if (this.isUp === null) {
        this.$label.innerText = "";

        return;
      }

      if (this.isUp) {
        this.$label.classList.add("badge-success");
        this.$label.innerText = "UP";

        return;
      }

      this.$label.classList.add("badge-danger");
      this.$label.innerText = "DOWN";
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceTitle#render()] Error: ${err.message}`);
    }
  }
}
