import type { ElementType, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type TextVariant = "title-1" | "title-2" | "title-3" | "body-1" | "body-2" | "caption" | "small";

type TextColor = "primary" | "secondary" | "subtitle" | "accent" | "error" | "white" | "black" | "inherit";

interface TextProps {
  variant: TextVariant;
  color?: TextColor;
  bold?: boolean;
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

const VARIANT_STYLES: Record<TextVariant, string> = {
  "title-1": "text-title-1",
  "title-2": "text-title-2",
  "title-3": "text-title-3",
  "body-1": "text-body-1",
  "body-2": "text-body-2",
  caption: "text-caption",
  small: "text-small",
};

const DEFAULT_ELEMENT: Record<TextVariant, ElementType> = {
  "title-1": "h1",
  "title-2": "h2",
  "title-3": "h3",
  "body-1": "p",
  "body-2": "p",
  caption: "span",
  small: "span",
};

const COLOR_STYLES: Record<TextColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  subtitle: "text-subtitle",
  accent: "text-accent",
  error: "text-red",
  white: "text-white",
  black:"text-black",
  inherit: "",
};

export function Text({ variant, color = "black", bold, as, className, id, children }: TextProps) {
  const Component = as ?? DEFAULT_ELEMENT[variant];

  return (
    <Component
      id={id}
      className={cn(VARIANT_STYLES[variant], COLOR_STYLES[color], bold && "font-bold", className)}
    >
      {children}
    </Component>
  );
}
