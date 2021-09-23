import axios from "axios";

export const defaults = {
  signalRUrl: process.env.REACT_APP_SIGNALR_URL || "https://localhost:5001",
  apiUrl: process.env.REACT_APP_API_URL || "https://localhost:5001",
};

const networkError = {
  Network: ["Error establishing connection to the server"],
};

const fetch = (method, url, data) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${defaults.apiUrl}${url}`,
      method,
      data: method !== "GET" ? data : undefined,
    }).then(
      (res) => {
        resolve(res);
      },
      (error) => {
        if (error.response) {
          const validationErrors = error.response.data.errors;
          reject(validationErrors);
        } else {
          reject(networkError);
        }
      }
    );
  });
};

const api = {
  get: (...args) => fetch("GET", ...args),
  post: (...args) => fetch("POST", ...args),
  put: (...args) => fetch("PUT", ...args),
};

export default api;
