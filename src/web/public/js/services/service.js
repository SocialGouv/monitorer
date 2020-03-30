import api from "../libs/api.js";

/**
 * @typedef {object} ServiceItem
 * @property {string} length
 * @property {string} uri
 */

/**
 * Manage services.
 */
class Service {
  /**
   * Get the checkpoint unique URIs list from the API.
   *
   * @returns {Promise<ServiceItem[]>}
   */
  async index() {
    try {
      return await api.get(`/services`);
    } catch (err) {
      console.error(`[server] [public/js/services/Service#index()] Error: ${err.message}`);

      return [];
    }
  }
}

export default new Service();
