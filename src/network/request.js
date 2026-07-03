import axios from "axios";
import Cookies from "js-cookie";

const request = async (httpConfig) => {
  const token = Cookies.get("token");

  try {
    const response = await axios({
      url: httpConfig.url,
      method: httpConfig.method,
      ...(httpConfig.data && { data: httpConfig.data }),
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      ...(httpConfig.params && { params: httpConfig.params }),
    });
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    return { success: false, data: message };
  }
};

export default request;
