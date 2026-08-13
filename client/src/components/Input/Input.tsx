import { forwardRef, useId } from "react";

import type { InputProps } from "../../interfaces/components";

import "./Input.css";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, id, label, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [props["aria-describedby"], error ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`inputGroup${error ? " inputGroup--invalid" : ""}`}>
      <label htmlFor={inputId}>{label}</label>
      <input
        {...props}
        id={inputId}
        ref={ref}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
      />
      {error && (
        <p className="inputGroup__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
