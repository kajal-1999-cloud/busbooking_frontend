import axios from "axios";
import Cookies from "js-cookie";
import { getApiErrorMessage } from "../utils/apiMessage";

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
    return {
      success: false,
      data: getApiErrorMessage(
        error.response?.data,
        error.message || "Something went wrong"
      ),
    };
  }
};

export default request;
