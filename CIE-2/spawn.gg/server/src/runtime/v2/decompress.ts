import { gunzipSync } from 'fflate';

/** Local WebView-compatible gzip decoder used before loading the bundled engine. */
export function gunzip(bytes: Uint8Array): Uint8Array {
  return gunzipSync(bytes);
}
