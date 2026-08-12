"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client (so initial animation states are applied
 * before the browser paints — no flash of the final text), falling back to
 * `useEffect` on the server to avoid React's SSR warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
