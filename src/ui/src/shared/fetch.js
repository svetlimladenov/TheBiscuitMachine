import axios from "axios";

export const defaults = {
  signalRUrl: "https://localhost:5001",
  apiUrl: "https://localhost:5001/",
};

const fetch = (method, url) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${defaults.apiUrl}${url}`,
      method,
    }).then(
      (res) => {
        resolve(res);
      },
      (err) => {
        console.error(err);
      }
    );
  });
};

export default fetch;
