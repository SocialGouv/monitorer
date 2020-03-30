import checkpointService from "../services/checkpoint.js";
import serviceService from "../services/service.js";

export default class Maintenance {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      /** @type {HTMLTableElement} */
      this.$node = $node;
      this.$body = $node.querySelector(".js-maintenance-body");

      this.load();
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
   * Load services.
   *
   * @returns {Promise<void>}
   */
  async load() {
    try {
      this.services = await serviceService.index();

      this.render();
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance#load()] Error: ${err.message}`);
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

      await checkpointService.delete(uri);

      this.load();
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

      await checkpointService.delete(uri, Date.now());

      this.load();
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance#drop()] Error: ${err.message}`);
    }
  }

  /**
   * Render service.
   *
   * @returns {void}
   */
  render() {
    try {
      const source = this.services
        .map(
          ({ length, uri }) => `
        <tr>
          <th scope="row">${uri}</th>
          <th class="text-right">${length}</th>
          <td class="table-buttonCell">
            <button
              class="js-maintenance-cleanButton btn btn-warning btn-sm"
              data-uri="${uri}"
              title="Remove older-than-one-week history for: ${uri}"
              type="button"
            >
              CLEAN
            </button>
          </td>
          <td class="table-buttonCell">
            <button
              class="js-maintenance-dropButton btn btn-danger btn-sm"
              data-uri="${uri}"
              title="Remove the entire history for: ${uri}"
              type="button"
            >
              DROP
            </button>
          </td>
        </tr>
      `,
        )
        .join("\n");

      this.$body.innerHTML = source;

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/Maintenance#render()] Error: ${err.message}`);
    }
  }
}
