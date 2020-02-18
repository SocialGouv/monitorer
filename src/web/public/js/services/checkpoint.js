import api from "../libs/api.js";
import axios from "../libs/axios.js";

/**
 * @typedef {object} CheckpointModel
 * @property {string} date
 * @property {number} latency
 */

/**
 * Manage checkpoints.
 */
class Checkpoint {
  /**
   * Get latest checkpoint from API.
   *
   * @param {string=} uri
   *
   * @returns {Promise<CheckpointModel>}
   */
  async latest(uri) {
    try {
      return await api.get(
        uri !== undefined ? `/checkpoints/latest?uri=${uri}` : `/checkpoints/latest`,
      );
    } catch (err) {
      console.error(`[server] [public/js/services/Checkpoint#latest()] Error: ${err.message}`);

      return [];
    }
  }

  /**
   * Get a list of checkpoints from API.
   *
   * @param {string} uri
   * @param {string} duration
   *
   * @returns {Promise<CheckpointModel[]>}
   */
  async index(uri, duration) {
    try {
      return await api.get(`/checkpoints?uri=${uri}&duration=${duration}`);
    } catch (err) {
      console.error(`[server] [public/js/services/Checkpoint#index()] Error: ${err.message}`);

      return [];
    }
  }

  /**
   * Delete checkpoints from API (since 7 days by default).
   *
   * @param {string} uri
   * @param {Date=} since
   *
   * @returns {Promise<void>}
   */
  async delete(uri, since) {
    if (since === undefined) {
      since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      since.setSeconds(0, 0);
    }

    try {
      await axios.delete(`/checkpoints?uri=${uri}&since=${since}`);
    } catch (err) {
      console.error(`[server] [public/js/services/Checkpoint#index()] Error: ${err.message}`);
    }
  }
}

export default new Checkpoint();
