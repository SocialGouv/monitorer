import axios from "../libs/axios.js";

/**
 * @typedef {object} ConfigurationModel
 * @property {string} source
 */

/**
 * Manage configuration.
 */
class Configuration {
  /**
   * Get the configuration from the API.
   *
   * @returns {ConfigurationModel | null}
   */
  async get() {
    try {
      const { data } = await axios.get("/configuration");

      return typeof data === "object" ? data : null;
    } catch (err) {
      console.error(`[web] [public/js/services/Configuration#get()] Error: ${err.message}`);

      return [];
    }
  }

  /**
   * Update the configuration via the API.
   *
   * @param {string} source
   *
   * @returns {Promise<void>}
   */
  async update(source) {
    try {
      await axios.patch(`/configuration`, { source });
    } catch (err) {
      if (
        err.response === undefined ||
        err.response.data === undefined ||
        err.response.data.errors === undefined
      ) {
        console.error(`[web] [public/js/services/Configuration#update()] Error: ${err.message}`);

        return;
      }

      throw err.response.data.errors;
    }
  }
}

export default new Configuration();
