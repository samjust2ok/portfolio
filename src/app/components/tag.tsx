import classNames from "classnames";
import { ComponentType, ReactNode } from "react";

export function Tag({
  children,
  variant = "normal",
  className,
  onClick,
  component,
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: "normal" | "large";
  onClick?: () => void;
  component?: ComponentType<any>;
  [key: string]: any;
}) {
  const El = component
    ? component
    : ((onClick ? "button" : "span") as keyof JSX.IntrinsicElements);
  return (
    <El
      onClick={onClick}
      className={classNames(
        "border border-border-color text-primary-text-color-darker text-xs px-1 py-0.5",
        {
          "px-4 py-2 rounded-full": variant === "large",
          "rounded-sm": variant === "normal",
        },
        className
      )}
      {...props}
    >
      {children}
    </El>
  );
}
