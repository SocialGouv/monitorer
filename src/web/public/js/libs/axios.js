/* global axios */

/**
 * @type {import("axios").AxiosInstance}
 */
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

export default axiosInstance;
