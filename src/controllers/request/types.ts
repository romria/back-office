/**
 * Discriminated union of every failure mode the request layer can produce.
 * Use `error.type` to narrow to the specific variant in a switch/if chain.
 */
export type RequestError =
  /** fetch() threw — no connection, DNS failure, CORS, etc. */
  | {type: 'network'; message: string}
  /** AbortController fired — request exceeded REQUEST_TIMEOUT_DURATION. */
  | {type: 'timeout'}
  /** Server replied with a non-2xx status. body is the parsed response payload, if any. */
  | {type: 'http'; status: number; statusText: string; body?: unknown}
  /** Response body could not be parsed as the expected format. */
  | {type: 'parse'; message: string}
  /** Successful response arrived with an unhandled Content-Type. */
  | {type: 'unexpected_content_type'; contentType: string}

/**
 * Discriminated result returned by every request.
 * On success `ok` is `true` and `data` holds the parsed response.
 * On failure `ok` is `false` and `error` holds the typed error.
 */
export type RequestResult<T> =
  | {ok: true; data: T}
  | {ok: false; error: RequestError}
