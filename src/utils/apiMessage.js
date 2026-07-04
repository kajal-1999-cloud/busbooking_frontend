/**
 * Prefer API `error` (specific reason) over generic `message` for toasts.
 */
export const getApiErrorMessage = (
  data,
  fallback = "Something went wrong. Please try again."
) => {
  if (data == null || data === "") return fallback;
  if (typeof data === "string") return data;

  const detail = data.error;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (detail && typeof detail === "object" && typeof detail.message === "string") {
    return detail.message;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallback;
};

/**
 * Use API `message` for success toasts only (never `error`).
 */
export const getApiSuccessMessage = (data, fallback) => {
  if (data == null) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  return fallback;
};
