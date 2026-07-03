import { message } from "antd";

message.config({ duration: 4, maxCount: 3 });

export const showError = (text) => {
  message.error(text || "Something went wrong. Please try again.");
};

export const showSuccess = (text) => {
  message.success(text);
};
