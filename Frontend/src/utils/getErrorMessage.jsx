// Turns an Axios/FastAPI error into a readable message.
// FastAPI returns `detail` as a string, or an array of validation errors (422).
const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((item) => item.msg).filter(Boolean).join(', ') || fallback;
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Please check your connection.';
  }

  return fallback;
};

export default getErrorMessage;
