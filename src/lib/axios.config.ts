import axios from "axios";

export function getAxios() {
  return axios.create({
    withCredentials: true,
    baseURL: `${window.location.origin}/api`,
  });
}
