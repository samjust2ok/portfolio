"use client";
import classNames from "classnames";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
export function Drawer({
  children,
  open,
  onClose,
}: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  const [hidden, setIsHidden] = useState(false);

  return (
    <RemoveScroll enabled={open}>
      <div
        onClick={onClose}
        className={classNames(
          "fixed inset-0 bottom-0 flex flex-col sm:flex-row justify-end duration-300 z-20",
          open ? "bg-[rgba(0,0,0,.6)]" : "pointer-events-none"
        )}
      >
        <div
          onTransitionEnd={() => {
            setIsHidden(!open);
          }}
          onClick={(e) => e.stopPropagation()}
          className={classNames(
            "bg-primary-color w-full h-[80%] sm:max-w-[28rem] sm:h-full transition-transform duration-300 ease-[cubic-bezier(0.215, 0.61, 0.355, 1.0)] shadow-drawer-y sm:shadow-drawer-x",
            open
              ? "translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-[30rem]",
            hidden && !open ? "opacity-0" : "opacity-100"
          )}
        >
          {children}
        </div>
      </div>
    </RemoveScroll>
  );
}
