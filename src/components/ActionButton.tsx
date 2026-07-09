import type { AriaAttributes, ReactNode } from "react";
import { Text } from "@/components/Text";
import { cn } from "@/shared/utils/cn";

type ActionButtonSize = "small" | "medium" | "large";
type ActionButtonVariant = "primary" | "secondary" | "outline";

interface ActionButtonProps extends AriaAttributes {
  title: string;
  size?: ActionButtonSize;
  variant?: ActionButtonVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const SIZE_STYLES: Record<ActionButtonSize, string> = {
  small: "h-9 gap-1 px-3",
  medium: "h-12 gap-1.5 px-4 min-w-[116px]",
  large: "h-16 gap-2 px-5 py-4",
};

const SIZE_TEXT_VARIANT: Record<ActionButtonSize, "caption" | "body-2" | "body-1"> = {
  small: "body-2",
  medium: "caption",
  large: "body-1",
};

const VARIANT_STYLES: Record<ActionButtonVariant, string> = {
  primary: "bg-accent text-white",
  secondary: "bg-light-gray text-secondary",
  outline: "border border-gray bg-white text-secondary",
};

export function ActionButton({
  title,
  size = "medium",
  variant = "outline",
  leadingIcon,
  trailingIcon,
  fullWidth,
  disabled = false,
  className,
  id,
  href,
  target,
  rel,
  type = "button",
  onClick,
  ...aria
}: ActionButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-lg transition-colors",
    SIZE_STYLES[size],
    VARIANT_STYLES[variant],
    fullWidth && "w-full",
    disabled && "pointer-events-none opacity-40",
    className,
  );

  const label = (
    <Text as="span" variant={SIZE_TEXT_VARIANT[size]} color="inherit">
      {title}
    </Text>
  );

  if (href && !disabled) {
    return (
      <a id={id} href={href} target={target} rel={rel} className={classes} {...aria}>
        {leadingIcon}
        {label}
        {trailingIcon}
      </a>
    );
  }

  return (
    <button id={id} type={type} onClick={onClick} disabled={disabled} className={classes} {...aria}>
      {leadingIcon}
      {label}
      {trailingIcon}
    </button>
  );
}
