"use client";
import { useEffect, useRef } from "react";

function Slider(node: HTMLElement, timer = 5000) {
  let toDelete: Element | null = null;
  let intervalId: number | null;
  node.addEventListener("transitionend", onAdded);
  function onAdded() {
    if (toDelete) {
      toDelete.remove();
      node.style.transition = "none";
      node.style.transform = "translateX(0px)";
      toDelete = null;
    }
  }
  function slide() {
    node.style.transition = "transform 500ms";
    const first = node.firstElementChild as HTMLElement;
    if (!first) return;
    const nodeClone = first.cloneNode(true);
    node.style.transform = "translateX(" + -1 * first.offsetWidth + "px)";
    node.appendChild(nodeClone);
    toDelete = first;
  }

  function startSlide() {
    endSlide();
    intervalId = setInterval(slide, timer) as any as number;
  }

  function endSlide() {
    onAdded();
    intervalId && clearInterval(intervalId);
  }

  window.addEventListener("blur", endSlide);
  window.addEventListener("focus", startSlide);

  return {
    startSlide,
    endSlide,
  };
}

export default function Slide({ slides }: { slides: string[] }) {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    const { startSlide, endSlide } = Slider(nodeRef.current, 2000);
    startSlide();
    return endSlide;
  }, []);

  return (
    <div ref={nodeRef} className="w-full max-w-full  flex">
      {slides.map((slide, i) => {
        return (
          <div
            className="w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6 flex-shrink-0 flex justify-center px-6"
            key={slide}
          >
            <img className="h-7" src={slide} />
          </div>
        );
      })}
    </div>
  );
}
