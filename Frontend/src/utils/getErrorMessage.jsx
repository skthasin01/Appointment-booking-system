// Turns Axios/FastAPI errors into readable titles and descriptions.
// FastAPI returns `detail` as a string, or an array of validation errors (422).

const STATUS_DETAILS = {
  400: {
    title: 'Check your request',
    description: 'The server could not accept that request. Review the details and try again.',
  },
  401: {
    title: 'Session expired',
    description: 'Sign in again to continue where you left off.',
  },
  403: {
    title: 'Access denied',
    description: 'You do not have permission to view or change this information.',
  },
  404: {
    title: 'Not found',
    description: 'The information you requested is no longer available.',
  },
  408: {
    title: 'Request timed out',
    description: 'The server took too long to respond. Please try again.',
  },
  409: {
    title: 'Conflicting change',
    description: 'This change conflicts with current data. Refresh and try again.',
  },
  422: {
    title: 'Check your input',
    description: 'Some fields need attention before this can continue.',
  },
  429: {
    title: 'Too many attempts',
    description: 'Wait a moment, then try again.',
  },
  500: {
    title: 'Server error',
    description: 'Something went wrong on our side. Please try again.',
  },
  502: {
    title: 'Server unavailable',
    description: 'The server is temporarily unavailable. Please try again shortly.',
  },
  503: {
    title: 'Service unavailable',
    description: 'The service is temporarily down for maintenance. Please try again shortly.',
  },
  504: {
    title: 'Gateway timed out',
    description: 'The server took too long to respond. Please try again.',
  },
};

const getDetail = (error) => {
  const payload = error?.response?.data;
  const detail = payload?.detail ?? payload?.message;

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return (
      detail
        .map((item) => item.msg || (typeof item === 'string' ? item : ''))
        .filter(Boolean)
        .join(', ') || null
    );
  }

  return null;
};

const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (typeof error === 'string') return error || fallback;

  const detail = getDetail(error);
  if (detail) return detail;

  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Cannot reach the server. Please check your connection.';
  }

  return STATUS_DETAILS[error.response.status]?.description || fallback;
};

export const getErrorDetails = (error, context = 'this content', fallback) => {
  if (typeof error === 'string') {
    return {
      title: `Could not load ${context}`,
      description: error,
    };
  }

  const detail = getDetail(error);

  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return {
      title: 'Connection problem',
      description: detail || 'We could not reach the server. Check your connection and try again.',
    };
  }

  const status = STATUS_DETAILS[error.response.status];
  if (status) {
    return {
      title: status.title,
      description: detail || status.description,
    };
  }

  return {
    title: `Could not load ${context}`,
    description:
      detail || fallback || 'An unexpected problem occurred. Please try again.',
  };
};

export const getErrorToast = (error, context, fallback) => {
  const details = getErrorDetails(error, context, fallback);
  return `${details.title}: ${details.description}`;
};

export default getErrorMessage;
