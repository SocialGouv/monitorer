import { EVENT } from "../constants.js";
import logService from "../services/log.js";

/**
 * @typedef {object} LogItem
 * @property {Date} from
 * @property {Date=} to
 */

export default class ServiceLog {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      this.$node = $node;

      /** @type {string[]} */
      this.logs = [];
      /** @type {string} */
      this.uri = $node.dataset.uri;

      this.update = this.update.bind(this);

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceLog()] Error: ${err.message}`);
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
      console.error(`[web] [public/js/components/ServiceLog#bindEvents()] Error: ${err.message}`);
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
      const detail = { ...event.detail };
      const { duration, uri } = detail;

      // Skip if it's not for this uri:
      if (uri !== this.uri) return;

      this.logs = await logService.index(uri, duration);

      this.render();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceLog#update()] Error: ${err.message}`);
    }
  }

  /**
   * Render chart.
   *
   * @returns {void}
   */
  render() {
    try {
      let source = "";

      source += `<pre><code>`;
      source += this.logs.map(this.humanize).join("\n");
      source += `</code></pre>`;

      this.$node.innerHTML = source;
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceLog#render()] Error: ${err.message}`);
    }
  }

  /**
   * Humanize a log item.
   *
   * @param {LogItem} logItem
   *
   * @returns {string}
   */
  humanize(logItem) {
    const from = window.moment(logItem.from);

    if (logItem.to === undefined) {
      const ago = from.fromNow();

      return `Went down ${ago}.`;
    }

    const to = window.moment(logItem.to);

    const delay = window.moment.duration(to.diff(from)).humanize();
    const on = from.format("LLLL");

    return `Was down for ${delay} on ${on}.`;
  }
}
