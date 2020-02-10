import configurationService from "../services/configuration.js";

let HAS_TO_RELOAD = false;

/**
 * Condition callback running to configuration availability.
 *
 * @param {() => void} callback
 *
 * @returns {Promise<void>}
 */
export default async function waitForInitializationAndRun(callback) {
  try {
    const configuration = await configurationService.get();

    if (configuration === null) {
      HAS_TO_RELOAD = true;
      setTimeout(() => waitForInitializationAndRun(callback), 1000);

      return;
    }

    if (HAS_TO_RELOAD) {
      window.location.reload();

      return;
    }

    callback();
  } catch (err) {
    console.error(`[web] [public/js/libs/waitForInitializationAndRun()] Error: ${err.message}`);
  }
}
