import ServiceChart from "../components/ServiceChart.js";
import ServiceLog from "../components/ServiceLog.js";
import ServiceTitle from "../components/ServiceTitle.js";
import { DURATION, EVENT } from "../constants.js";
import checkpoint from "../services/checkpoint.js";

export default class Dashboard {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      this.$node = $node;
      this.$durationButtons = [...$node.querySelectorAll(".js-durationButton")];
      this.$serviceCharts = [...$node.querySelectorAll(".js-serviceChart")];
      this.$serviceLogs = [...$node.querySelectorAll(".js-serviceLog")];
      this.$serviceTitles = [...$node.querySelectorAll(".js-serviceTitle")];

      this.duration = DURATION.ONE_DAY;
      /** @type {number | null} */
      this.timeout = null;

      this.bindEvents();
      this.render();
      this.update();
    } catch (err) {
      console.error(`[web] [public/js/components/Dashboard()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      this.$durationButtons.forEach($durationButton =>
        $durationButton.addEventListener("click", this.updateDuration.bind(this)),
      );
    } catch (err) {
      console.error(`[web] [public/js/components/Dashboard#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update duration.
   *
   * @param {MouseEvent} event
   *
   * @returns {void}
   */
  async updateDuration(event) {
    try {
      if (this.timeout !== null) window.clearTimeout(this.timeout);

      const { target: $durationButton } = event;
      const { duration } = $durationButton.dataset;

      this.$durationButtons.map($durationButton => $durationButton.classList.remove("active"));
      $durationButton.classList.add("active");

      this.duration = duration;
      this.update(true);
    } catch (err) {
      console.error(
        `[web] [public/js/components/Dashboard#updateDuration()] Error: ${err.message}`,
      );
    }
  }

  /**
   * Update Dashboard data.
   *
   * @param {boolean=} isForced
   *
   * @returns {Promise<void>}
   */
  async update(isForced = false) {
    try {
      const checkpoints = await checkpoint.index(this.duration);
      if (checkpoints.length !== 0) {
        if (!isForced && checkpoints[0].date === this.lastCheckpointDate) {
          this.timeout = window.setTimeout(this.update.bind(this), 1000);

          return;
        }

        this.lastCheckpointDate = checkpoints[0].date;
      }

      const customEvent = new CustomEvent(EVENT.UPDATE_CHECKPOINTS, {
        detail: { checkpoints, duration: this.duration },
      });
      document.dispatchEvent(customEvent);

      this.timeout = window.setTimeout(this.update.bind(this), 1000);
    } catch (err) {
      console.error(`[web] [public/js/components/Dashboard#update()] Error: ${err.message}`);
    }
  }

  /**
   * Render Dashboard.
   *
   * @returns {void}
   */
  render() {
    try {
      this.$serviceCharts.forEach($serviceChart => new ServiceChart($serviceChart));
      this.$serviceLogs.forEach($serviceLog => new ServiceLog($serviceLog));
      this.$serviceTitles.forEach($serviceTitle => new ServiceTitle($serviceTitle));
    } catch (err) {
      console.error(`[web] [public/js/components/Dashboard#render()] Error: ${err.message}`);
    }
  }
}
