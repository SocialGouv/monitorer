import api from "../libs/api.js";

/**
 * @typedef {object} LogItem
 * @property {Date} from
 * @property {Date=} to
 */

/**
 * Manage logs.
 */
class Log {
  /**
   * Get a list of logs from API.
   *
   * @param {string} uri
   * @param {string} duration
   *
   * @returns {Promise<LogItem[]>}
   */
  async index(uri, duration) {
    try {
      return await api.get(`/logs?uri=${uri}&duration=${duration}`);
    } catch (err) {
      console.error(`[server] [public/js/services/Log#index()] Error: ${err.message}`);

      return [];
    }
  }
}

export default new Log();
