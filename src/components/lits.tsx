"use client";
import classNames from "classnames";
import React, { ReactNode, useEffect, useRef } from "react";

const SPACE = 100;
const MIN_PERCENTAGE = 15;

interface LittedI {
  className: string;
  children: ReactNode;
}

export default function Lits({ children, className }: LittedI) {
  const positionRef = useRef(new WeakMap());
  const isIn = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const nodes = useRef<HTMLElement[]>([]);

  function onMove(e: React.MouseEvent) {
    const event = e.nativeEvent;
    const px = event.clientX;
    const py = event.clientY;

    nodes.current.forEach((node) => {
      const position = positionRef.current.get(node);
      if (!position) return;
      const { cx, cy, width, boundCircleRadius, bufferCircleRadius } = position;
      const within = isPointInCircle(cx, cy, px, py, bufferCircleRadius);
      node.toggleAttribute("data-litted", within);
      if (within) {
        let distance = distanceFromCircle(cx, cy, px, py, boundCircleRadius);
        let pointAngle = getAngle(cx, cy, px, py);
        // Correct for circle angle and css linear gradient angle
        pointAngle -= 90; //(90 degrees);
        node.style.setProperty(
          "--lit-bg",
          getLightShadow(pointAngle, distance, width)
        );
      } else {
        node.style.setProperty("--lit-bg", "none");
      }
    });
  }

  function onLeave() {
    nodes.current.forEach((node) => node.removeAttribute("data-litted"));
    isIn.current = false;
  }

  function setDimensions() {
    if (!ref.current) return;
    nodes.current.forEach((node) => {
      const dim = node.getBoundingClientRect();
      Object.assign(dim, {
        boundCircleRadius: getRadiusOfBoundingCircleOfARectangle(
          dim.height,
          dim.width
        ),
        bufferCircleRadius: getRadiusOfBoundingCircleOfARectangle(
          dim.height + SPACE,
          dim.width + SPACE
        ),
        cy: dim.top + dim.height / 2,
        cx: dim.left + dim.width / 2,
      });
      positionRef.current.set(node, dim);
    });
  }

  function onEnter() {
    setDimensions();
    isIn.current = true;
  }

  useEffect(() => {
    nodes.current = Array.from(ref.current?.children ?? []) as HTMLElement[];
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      className={classNames("lits-container", className)}
    >
      {children}
    </div>
  );
}

interface LitI {
  children: ReactNode;
  contentClassName: string;
  className: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType;
  elementProps: Record<string, any>;
  radius?: number;
}

export function Lit({
  children,
  contentClassName,
  as: Element = "div",
  className,
  elementProps: { ...otherProps },
  radius = 2,
}: LitI) {
  return (
    <Element
      {...otherProps}
      style={{ borderRadius: radius + "px" }}
      className={classNames(
        "group relative inline-flex items-center overflow-hidden transition bg-[--highlight-sub-color]",
        className
      )}
    >
      <div className="lit-effect-container absolute inset-0 flex items-center [container-type:inline-size]">
        <div className="lit-effect absolute h-[100cqh] w-[100cqw] bg-[conic-gradient(from_0_at_50%_50%,var(--highlight-color)_0deg,transparent_60deg,transparent_300deg,var(--highlight-color)_360deg)] opacity-0 transition group-hover:opacity-100"></div>
      </div>

      <div
        className="lits-overlay absolute inset-[0.9px]"
        style={{ borderRadius: radius - 0.9 + "px" }}
      ></div>

      <div className={classNames(contentClassName, "z-10")}>{children}</div>
    </Element>
  );
}

function getRadiusOfBoundingCircleOfARectangle(h: number, w: number) {
  const r = Math.max(h, w);
  return Math.sqrt(r ** 2 / 4 + r ** 2 / 4);
}

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function distanceFromCircle(
  cx: number,
  cy: number,
  px: number,
  py: number,
  r: number
) {
  // Calculate the distance between the point and the center of the circle
  const distance = distanceBetweenPoints(cx, cy, px, py);
  // Calculate how far off the point is from the circle
  return distance - r;
}

function isPointInCircle(
  cx: number,
  cy: number,
  px: number,
  py: number,
  r: number
) {
  const distance = distanceBetweenPoints(cx, cy, px, py);
  return distance <= r;
}

function getAngle(cx: number, cy: number, px: number, py: number) {
  const deltaX = px - cx;
  const deltaY = py - cy;
  const angleRadians = Math.atan2(deltaY, deltaX);
  let angleDegrees = angleRadians * (180 / Math.PI);

  // Ensure the angle is in the range [0, 360)
  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return angleDegrees;
}

function getLightShadow(
  angle: number,
  distanceAway: number,
  containerWidth: number
) {
  return `linear-gradient(
    ${angle.toFixed(2)}deg,
    var(--highlight-color),
    var(--highlight-sub-color) ${Math.floor(
      Math.min(
        MIN_PERCENTAGE - (distanceAway / containerWidth) * 100,
        MIN_PERCENTAGE
      )
    )}%
  )`;
}
