import { type InputHTMLAttributes, forwardRef } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = "", ...props }, ref) => {
    const classes = ["input", hasError && "input-error", className]
      .filter(Boolean)
      .join(" ");

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";
