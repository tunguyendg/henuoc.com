import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const widths = {
  marketing: "max-w-6xl",
  app: "max-w-7xl",
  prose: "max-w-3xl",
} as const;

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: keyof typeof widths;
}

export function Container({ width = "marketing", className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-5 md:px-8", widths[width], className)} {...props} />;
}
