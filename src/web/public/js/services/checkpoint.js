import axios from "../libs/axios.js";

/**
 * @typedef {object} CheckpointModel
 * @property {Date} date
 * @property {boolean} isUp
 * @property {number} latency
 * @property {string} uri
 */

/**
 * Manage checkpoints.
 */
class Checkpoint {
  /**
   * Get a list of checkpoints from the API.
   *
   * @param {string} uri
   *
   * @returns {CheckpointModel[]}
   */
  async index(uri) {
    try {
      const { data } = await axios.get(`/checkpoints?uri=${uri}`);

      return data;
    } catch (err) {
      console.error(`[server] [public/js/services/Checkpoint#index()] Error: ${err.message}`);

      return [];
    }
  }

  /**
   * Delete checkpoints from the API (until 7 days ago by default).
   *
   * @param {string} uri
   * @param {Date} until
   *
   * @returns {CheckpointModel[]}
   */
  async delete(uri, until) {
    if (until === undefined) {
      until = new Date();
      until.setDate(until.getDate() - 7);
    }

    try {
      await axios.delete(`/checkpoints?uri=${uri}&until=${until}`);
    } catch (err) {
      console.error(`[server] [public/js/services/Checkpoint#index()] Error: ${err.message}`);
    }
  }
}

export default new Checkpoint();
