import axios from "axios";

export const defaults = {
  signalRUrl: "https://localhost:5001",
  apiUrl: "https://localhost:5001",
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
        const validationErrors = error.response.data.errors;
        reject(validationErrors);
      }
    );
  });
};

const api = {
  get: (...args) => fetch("GET", ...args),
  post: (...args) => fetch("POST", ...args),
};

export default api;
