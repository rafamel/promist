/**
 * Will wait for `ms` milliseconds before resolving with an empty response.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
