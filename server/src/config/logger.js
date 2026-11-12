// FlowEM Logger - Structured, zero-emoji application logging

function getTimestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (msg, meta = '') => {
    console.log(`[${getTimestamp()}] [INFO] ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`[${getTimestamp()}] [WARN] ${msg}`, meta ? meta : '');
  },
  error: (msg, err = '') => {
    console.error(`[${getTimestamp()}] [ERROR] ${msg}`, err ? err : '');
  },
  debug: (msg, meta = '') => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${getTimestamp()}] [DEBUG] ${msg}`, meta ? meta : '');
    }
  }
};

