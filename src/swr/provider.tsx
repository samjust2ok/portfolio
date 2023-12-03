"use client";
import { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

export const SWRProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: Record<any, any> }>) => {
  return <SWRConfig value={value}>{children}</SWRConfig>;
};
