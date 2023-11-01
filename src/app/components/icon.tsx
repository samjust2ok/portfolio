import classNames from "classnames";
import { forwardRef } from "react";

interface IconI {
  icon: string;
  className?: string;
}

const Icon = forwardRef<SVGSVGElement, IconI>(function Icon(
  { icon, className: cls },
  ref
) {
  return (
    <svg ref={ref} className={cls}>
      <use href={`/sprite.svg#${icon}`} />
    </svg>
  );
});

export { Icon };
