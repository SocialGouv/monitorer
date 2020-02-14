import { EVENT } from "../constants.js";

/**
 * @typedef {object} LogDataItem
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

      /** @type {LogDataItem[]} */
      this.data = [];
      /** @type {string} */
      this.uri = $node.dataset.uri;

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
      document.addEventListener(EVENT.UPDATE_CHECKPOINTS, this.update.bind(this));
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
      const {
        detail: { checkpoints },
      } = event;

      const filteredCheckpoints = checkpoints.filter(({ uri }) => uri === this.uri);
      const sortedCheckpoints = filteredCheckpoints.reverse();
      this.data = sortedCheckpoints.reduce((prev, { date, isUp }) => {
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
      // const lastOfPrev = this.data[this.data.length - 1];
      let source = "";

      // if (this.data.length === 0 || lastOfPrev.to !== undefined) {
      //   source += `<h4><span class="badge badge-success">UP</span></h4>`;
      // } else {
      //   source += `<h4><span class="badge badge-danger">DOWN</span></h4>`;
      // }

      source += `<pre><code>`;
      source += this.data
        .reverse()
        .map(this.humanize)
        .join("\n");
      source += `</code></pre>`;

      this.$node.innerHTML = source;
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceLog#render()] Error: ${err.message}`);
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
