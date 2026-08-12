"use client";

import { useEffect, useState } from "react";

/** True on coarse-pointer / no-hover devices — used to disable the custom cursor. */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (hover: none)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return touch;
}
