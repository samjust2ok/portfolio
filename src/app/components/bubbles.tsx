"use client";

import React, { useEffect, useRef } from "react";
import { getRandomNumber } from "../utilities/helpers";
import { useSound, useWindowSize } from "../utilities/hooks";

const SPHERE_SRC = "sphere.png";
const SPHERES_COUNT = 20;
const MAX_SIZE = 20;
const MAX_SPEED = 5;
const MIN_SPEED = 0.05;

const SIZES = (function getSizes() {
  let diff = 0.1;
  let last = 0.5;
  let sizes = [0.5];
  let i = 0;

  while (last < 22) {
    last = sizes[i + 1] = +Number(sizes[i] + diff).toFixed(1);
    i++;
    if (i % 10 === 0) diff = diff + diff;
  }
  return sizes;
})();

export function Bubbles() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  if (windowWidth < 610) return null;
  return <Bubbly windowWidth={windowWidth} windowHeight={windowHeight} />;
}

function Bubbly({
  windowWidth,
  windowHeight,
}: {
  windowWidth: number;
  windowHeight: number;
}) {
  let ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | null>(null);
  const spheres = useRef<Sphere[]>([]);
  const dimension = useRef<any>();
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const playBubbleAdd = useSound("bubble-add");
  const playBubbleRemove = useSound("bubble-remove-2");

  useEffect(() => {
    const canvas = ref.current;
    const ctx = (contextRef.current = canvas?.getContext("2d"));
    if (!canvas || !ctx) return;

    const dim = (dimension.current = canvas.getBoundingClientRect());
    const dpr = devicePixelRatio;

    canvas.width = dim.width * dpr;
    canvas.height = dim.height * dpr;

    spheres.current = Array.from({ length: SPHERES_COUNT }).map(
      () => new Sphere(dimension.current, ctx)
    );

    ctx.scale(dpr, dpr);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spheres.current = spheres.current.filter((sphere) => {
        let isDone = sphere.draw();
        return !isDone;
      });
      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);

    return () => {
      raf.current && cancelAnimationFrame(raf.current);
    };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    window.addEventListener("click", handleCanvasClick);
    return () => window.removeEventListener("click", handleCanvasClick);
  }, []);

  const handleCanvasClick = (e: MouseEvent) => {
    const canvas = ref.current!;
    if (!canvas) return;
    const xPos = e.clientX - canvas.offsetLeft;
    const yPos = e.clientY - canvas.offsetTop;
    const sphereWithinClickVicinityIndex = getSphereWithinClickArea(
      spheres.current,
      xPos,
      yPos
    );
    const ctx = contextRef.current!;
    if (sphereWithinClickVicinityIndex == -1) {
      // Add a new sphere at that position
      const s = getRandomNumber(10, 22);
      spheres.current.push(
        new Sphere(dimension.current, ctx, true, xPos - s / 2, yPos - s / 2, s)
      );
      playBubbleAdd();
    } else {
      let sphere = spheres.current[sphereWithinClickVicinityIndex];
      // Remove the reached sphere
      spheres.current.splice(sphereWithinClickVicinityIndex, 1);
      let breakApartCount = getRandomNumber(0, 10);

      // Add a random number of spheres and show them as scattered
      for (let i = 0; i < breakApartCount; i++) {
        const s = getRandomNumber(0.5, Math.min(sphere.size * 0.75, 9));
        spheres.current.push(
          new Sphere(
            dimension.current,
            ctx,
            true,
            xPos - s / 2,
            yPos - s / 2,
            s,
            true
          )
        );
      }
      playBubbleRemove();
    }
  };
  return <canvas className="object-contain h-full w-full" ref={ref}></canvas>;
}

function getSphereWithinClickArea(
  spheres: Sphere[],
  xPos: number,
  yPos: number
) {
  return spheres.findIndex(({ x, y, size }) => {
    return xPos >= x && xPos <= x + size && yPos >= y && yPos <= y + size;
  });
}

class Sphere {
  size: number;
  x: number;
  y: number;
  speed: number;
  image: HTMLImageElement;
  ctx: CanvasRenderingContext2D;
  canvasDimension: DOMRect;
  terminateOnComplete = false;
  opacity: number;
  scatterInitial: boolean = false;
  angleX: number;
  totalAngledX: number;
  initX: number;

  constructor(
    canvasDimension: DOMRect,
    ctx: CanvasRenderingContext2D,
    terminateOnComplete = false,
    x?: number,
    y?: number,
    size?: number,
    scatterInitial?: boolean
  ) {
    this.terminateOnComplete = terminateOnComplete;
    this.scatterInitial = !!scatterInitial;
    this.canvasDimension = canvasDimension;
    this.ctx = ctx;
    this.opacity = +Number(Math.random() * 1).toFixed(2);
    this.size = size || SIZES[getRandomNumber(0, SIZES.length - 1)];
    this.speed = this.getSpeed();
    this.x = x ?? this.getX();
    this.y = y ?? getRandomNumber(0, canvasDimension.height);
    const angle = Math.random() * 2 * Math.PI;
    this.angleX = 1 * Math.cos(angle);
    this.totalAngledX = getRandomNumber(5, 50);
    this.initX = this.x;

    this.image = new Image();
    this.image.src = SPHERE_SRC;
  }

  getSpeed() {
    return Math.max((MAX_SPEED * Math.random()) / this.size, MIN_SPEED);
  }

  getX() {
    return getRandomNumber(MAX_SIZE, this.canvasDimension.width - MAX_SIZE);
  }

  draw() {
    let isLarge = this.size >= 10;
    isLarge ? this.drawSphere() : this.drawCircle();
    this.y -= this.speed;
    if (
      this.scatterInitial &&
      Math.abs(this.x - this.initX) <= this.totalAngledX
    ) {
      this.x += this.angleX;
    }
    if (this.y <= -1 * this.size) {
      this.y = this.canvasDimension.height;
      this.x = this.getX();
      this.speed = this.getSpeed();
      return this.terminateOnComplete;
    }
    return false;
  }

  drawCircle() {
    const rad = this.size / 2;
    this.ctx.beginPath();
    this.ctx.arc(this.x + rad, this.y + rad, rad, 0, 2 * Math.PI);
    this.ctx.fillStyle = `rgba(86, 87, 88, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawSphere() {
    this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}
