import { CHART_LENGTH, EVENT } from "../constants.js";
import checkpoint from "../services/checkpoint.js";

/**
 * @typedef {object} LogDataItem
 * @property {Date} from
 * @property {Date=} to
 */

export default class Log {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      this.$node = $node;

      /** @type {LogDataItem[]} */
      this.data = [];
      this.length = CHART_LENGTH["1D"];
      this.uri = $node.dataset.uri;

      this.bindEvents();
      this.update();
    } catch (err) {
      console.error(`[web] [public/js/components/Log()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      document.addEventListener(EVENT.UPDATE_CHART_LENGTH, this.updateLength.bind(this));
    } catch (err) {
      console.error(`[web] [public/js/components/Log#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update chart length.
   *
   * @param {MouseEvent} event
   *
   * @returns {void}
   */
  async updateLength(event) {
    try {
      clearTimeout(this.timeout);

      const { detail: length } = event;

      this.length = length;
      await this.update(true);
    } catch (err) {
      console.error(`[web] [public/js/components/Log#updateLength()] Error: ${err.message}`);
    }
  }

  /**
   * Update log data.
   *
   * @param {boolean=} isForced
   *
   * @returns {Promise<void>}
   */
  async update(isForced = false) {
    try {
      const checkpoints = await checkpoint.index(this.uri, this.length);
      if (checkpoints.length !== 0) {
        if (!isForced && checkpoints[0].date === this.lastCheckpointDate) return;
        this.lastCheckpointDate = checkpoints[0].date;
      }

      this.data = checkpoints.reverse().reduce((prev, { date, isUp }) => {
        if (prev.length === 0) {
          if (!isUp) prev.push({ from: date });

          return prev;
        }

        const lastOfPrev = prev[prev.length - 1];
        if (!isUp && lastOfPrev.to !== undefined) prev.push({ from: date });
        if (isUp && lastOfPrev.to === undefined) lastOfPrev.to = date;

        return prev;
      }, []);
      this.render();

      this.timeout = setTimeout(this.update.bind(this), 1000);
    } catch (err) {
      console.error(`[web] [public/js/components/Log#update()] Error: ${err.message}`);
    }
  }

  /**
   * Render chart.
   *
   * @returns {void}
   */
  render() {
    try {
      const lastOfPrev = this.data[this.data.length - 1];
      let source = "";

      if (this.data.length === 0 || lastOfPrev.to !== undefined) {
        source += `<h4><span class="badge badge-success">UP</span></h4>`;
      } else {
        source += `<h4><span class="badge badge-danger">DOWN</span></h4>`;
      }

      source += `<pre class="flex-grow-1"><code>`;
      source += this.data
        .reverse()
        .map(this.humanize)
        .join("\n");
      source += `</code></pre>`;

      this.$node.innerHTML = source;
    } catch (err) {
      console.error(`[web] [public/js/components/Log#render()] Error: ${err.message}`);
    }
  }

  /**
   * Humanize a date.
   *
   * @param {LogDataItem} dataItem
   *
   * @returns {string}
   */
  humanize(dataItem) {
    const from = window.moment(dataItem.from);

    if (dataItem.to === undefined) {
      const ago = from.fromNow();

      return `Went down ${ago}.`;
    }

    const to = window.moment(dataItem.to);

    const delay = window.moment.duration(to.diff(from)).humanize();
    const on = from.format("LLLL");

    return `Was down for ${delay} on ${on}.`;
  }
}
