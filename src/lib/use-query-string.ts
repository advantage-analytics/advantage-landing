import { useSyncExternalStore } from "react";

// The page's query string, read without an effect and without making the page
// dynamic: empty on the server and during hydration, the real one after.
const noSubscribe = () => () => {};

export function useQueryString(): string {
  return useSyncExternalStore(
    noSubscribe,
    () => window.location.search,
    () => "",
  );
}
