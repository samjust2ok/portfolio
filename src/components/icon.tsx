import classNames from "classnames";
import { forwardRef } from "react";

interface IconI {
  icon: string;
  className?: string;
}

export const Icon = forwardRef<SVGSVGElement, IconI>(function Icon(
  { icon, className },
  ref
) {
  return (
    <svg ref={ref} className={className}>
      <use href={`/sprite.svg#${icon}`} />
    </svg>
  );
});
