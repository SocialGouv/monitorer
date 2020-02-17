import { EVENT } from "../constants.js";

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
      document.addEventListener(EVENT.UPDATE_CHECKPOINTS, this.update.bind(this));
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceTitle#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update log data.
   *
   * @param {Event} event
   *
   * @returns {Promise<void>}
   */
  async update(event) {
    try {
      const {
        detail: { checkpoints },
      } = event;

      const filteredCheckpoints = checkpoints.filter(({ uri }) => uri === this.uri);
      const lastCheckpoint = filteredCheckpoints[0];
      this.isUp = lastCheckpoint.isUp;

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
