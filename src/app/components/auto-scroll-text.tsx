"use client";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { m } from "framer-motion";
import { useInterval } from "../utilities/hooks";
import classNames from "classnames";
interface AutoScrollTextI {
  texts: string[];
  className?: string;
}

export function AutoScrollText({ texts, className }: AutoScrollTextI) {
  const [index, setIndex] = useState(0);
  useInterval(() => setIndex((i) => ++i % texts.length), 3500);
  const max = useMemo(
    () => texts.slice(0).sort((a, b) => b.length - a.length)[0],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texts.toString()]
  );
  return (
    <LazyMotion features={domAnimation}>
      <span className={classNames("relative", className)}>
        {/* Placeholder to avoid layout shift */}
        <span aria-hidden="true" className="opacity-0 inline-block">
          {max}
        </span>
        <AnimatePresence initial={false}>
          <m.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            data-text={texts[index]}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute left-0"
          >
            {texts[index]}
          </m.span>
        </AnimatePresence>
      </span>
    </LazyMotion>
  );
}
