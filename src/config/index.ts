const appApiBaseUrl = process.env.APP_API_BASE_URL;
if (appApiBaseUrl == null || appApiBaseUrl === '') throw new Error('APP_API_BASE_URL is not set. Copy .env.example to .env and fill in the value.');
export const API_BASE_URL: string = appApiBaseUrl;
export const DEFAULT_REQUEST_HEADERS = {
  // 'Access-Control-Request-Headers': 'Content-Type',
  // 'Access-Control-Expose-Headers': 'Content-Disposition',
  Accept: 'application/json',
  // 'Content-Type': 'application/json; charset=UTF-8',
};

// export const API_V1 = '/api/v1'

export const REQUEST_TIMEOUT_DURATION = 15000; // 15 seconds

// Feature flags — driven by env vars so they can differ per environment
// without a code change. Cast to boolean: the env value is always a string.
export const FEATURE_DARK_MODE = process.env.APP_FEATURE_DARK_MODE === 'true';

export const MB = 1048576; // 1Mb

export const DEFAULT_FILE_SIZE_LIMIT = 5 * MB;

export const DEFAULT_IMAGE_ACCEPT = 'image/png, image/jpeg';
export const DEFAULT_IMAGE_HEIGHT_LIMIT = 2048;
export const DEFAULT_IMAGE_WIDTH_LIMIT = 2048;
export const DEFAULT_IMAGE_SIZE_LIMIT = 6 * MB;

export const AVATAR_HEIGHT_LIMIT = 1024;
export const AVATAR_WIDTH_LIMIT = 1024;
export const AVATAR_SIZE_LIMIT = 4 * MB;

export const VISIBLE_TOASTS_LIMIT = 5;
export const TOAST_DEFAULT_DISMISS_TIME = 4000;
export const TOAST_ERROR_DISMISS_TIME = 8000; // -1 is infinite

export const TABLE_ROWS_LIMIT_DEFAULT = 10;
