/**
 * @type {import("axios").AxiosInstance}
 */
const axiosInstance = window.axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

export default axiosInstance;
