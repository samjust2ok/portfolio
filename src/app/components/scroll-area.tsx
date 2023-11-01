"use client";

import React from "react";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";

export function ScrollArea({
  children,
  className,
  ...otherProps
}: RadixScrollArea.ScrollAreaProps) {
  return (
    <RadixScrollArea.Root
      className={`h-full w-full ${className}`}
      {...otherProps}
    >
      <RadixScrollArea.Viewport className="h-full w-full">
        {children}
      </RadixScrollArea.Viewport>
      <Scrollbar orientation="vertical" />
      <Scrollbar orientation="horizontal" />
      <RadixScrollArea.Corner className="bg-black-200" />
    </RadixScrollArea.Root>
  );
}

const Scrollbar = ({
  orientation,
}: {
  orientation: "vertical" | "horizontal";
}) => {
  return (
    <RadixScrollArea.Scrollbar
      className="flex select-none touch-none bg-transparent hover:w-[--scrollbar-size-hover] w-[--scrollbar-size] p-[2px] transition-all duration-150 ease-out"
      orientation={orientation}
    >
      <RadixScrollArea.Thumb
        className="scrollbar-thumb relative flex-1 bg-scrollbar-color rounded-[--scrollbar-size] 
before:absolute before:top-1/2 before:left-1/2 before:translate-x-1/2 
before:translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h[44px]"
      />
    </RadixScrollArea.Scrollbar>
  );
};
