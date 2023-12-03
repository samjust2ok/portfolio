"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { APP_USER_NAME } from "../app/constants/general";
import { throttle } from "./helpers";

export function useInterval(cb: Function, duration: number | null) {
  const intervalRef = useRef<number | null>(null);
  const callback = useRef(cb);
  useEffect(() => {
    const clear = () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
    const add = () => {
      if (duration)
        intervalRef.current = setInterval(callback.current, duration);
    };
    add();
    window.addEventListener("blur", clear);
    window.addEventListener("focus", add);
    return () => {
      clear();
      window.removeEventListener("blur", clear);
      window.removeEventListener("focus", add);
    };
  }, [duration]);
}

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    function getSize() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    const cb = throttle(() => setSize(getSize()), 500);
    setSize(getSize());
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  return size;
}

interface AudioSrcI {
  src: string;
  type: string;
}

const types: Record<string, string> = {
  mp3: "mpeg",
  ogg: "ogg",
};
export function useSound(src: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    for (const type in types) {
      let a = new Audio(`${src}.${type}`);
      if (a.canPlayType(`audio/${types[type]}`) === "probably") {
        audio.current = a;
        break;
      }
    }
    if (!audio.current) throw Error("Unsupported audio types");
  }, [src]);

  const play = useCallback(() => {
    audio.current?.play();
  }, []);

  return play;
}

export const useCopyToClipboard = (copiedStateDuration: number) => {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(
    (text: string) => {
      if (copied) return;
      try {
        window.navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), copiedStateDuration);
      } catch (e) {
        setCopied(false);
      }
    },
    [copiedStateDuration, copied]
  );

  return [copied, onCopy] as const;
};

export function useOptimistic<T, A>(
  initial: T,
  reducer: (currentState: T, newState: A) => T
) {
  const [state, setState] = useState(initial);
  const updater = async (value: A, resolver?: Promise<any>) => {
    setState(reducer(state, value));
    if (!resolver) return;
    try {
      await resolver;
    } catch (e) {
      setState(state);
    }
  };

  return [state, updater] as const;
}
