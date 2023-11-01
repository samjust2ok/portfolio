"use client";

import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Icon } from "./icon";

export function LikeIcon({ className }: { className: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const parent = ref.current!;
    const svg = parent.firstElementChild!;
    let timeout: any;

    function addRibbons() {
      const effect = document.createElement("span");
      effect.classList.add("effect");
      effect.innerHTML = effectHtml;
      parent.appendChild(effect);
      effect
        .querySelector("animateMotion")
        ?.addEventListener("endEvent", () => effect.remove());
    }

    parent?.closest("button")?.addEventListener("click", () => {
      if (timeout) clearTimeout(timeout);
      addRibbons();
      if (!timeout) svg.classList.add("tada");
      timeout = setTimeout(() => {
        svg.classList.remove("tada");
        timeout = null;
      }, 700);
    });
  }, []);
  return (
    <span className="relative Like-icon" ref={ref}>
      <Icon
        className={classNames("z-10 relative", className)}
        icon="thumbs-up"
      />
    </span>
  );
}

const effectHtml = `<span>
<span>
    <svg
      width="38"
      height="30"
      viewBox="0 0 209 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3564 0.305438L41.0488 32.8171L32.9832 44.3174C14.7918 31.1448 12.1361 29.0564 0.091435 14.6401C3.61288 7.49819 6.30258 4.1598 13.3564 0.305438Z"
        fill="#ED7938"
      >
        <animateMotion
          dur="0.7s"
          path="M208 127.5C177.5 29.4969 136.5 -13 0.500037 5.49996"
          rotate="auto-reverse"
        ></animateMotion>
      </path>
    </svg>
  </span>
</span>
<span>
  <span>
    <svg
      width="35"
      height="30"
      viewBox="0 0 202 109"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.57544 0L33.0555 17.9668L29.9365 27.2678C14.3344 21.138 12.0205 20.1285 0.442756 12.1229L6.57544 0Z"
        fill="#3CED38"
      >
        <animateMotion
          dur="0.7s"
          path="M201 118.5C170.5 20.4968 108 -26.5 1 18.5"
          rotate="auto-reverse"
        ></animateMotion>
      </path>
    </svg>
  </span>
</span>
<span>
  <span>
    <svg
      width="45"
      height="50"
      viewBox="0 0 334 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38 15L12.3782 24.9721L0.148344 21.1175C13.6525 9.13882 15.7531 7.41675 29.1434 0.404028L38 15Z"
        fill="#EDDB38"
      >
        <animateMotion
          dur=".7s"
          path="M0.947486 86.7895C56.4827 15.1204 256.978 -16.4195 333.5 11"
          rotate="auto-reverse"
        ></animateMotion>
      </path>
    </svg>
  </span>
</span>
<span>
  <span>
    <svg
      width="34"
      height="33"
      viewBox="0 0 334 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.8744 7.65404L10 30.5L0.5 26C6.08249 11.1156 5.80105 9.99486 16 -1.32278e-05L31.8744 7.65404Z"
        fill="#ED3838"
      >
        <animateMotion
          dur="0.7s"
          path="M1.26611 86.1555C43.9326 6.60317 105.838 -25.871 191 25"
          rotate="auto-reverse"
        ></animateMotion>
      </path>
    </svg>
  </span>
</span>`;
