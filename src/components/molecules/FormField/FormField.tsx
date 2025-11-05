import { type InputHTMLAttributes, forwardRef } from "react";
import { Input } from "../../atoms/Input/Input";
import "./FormField.css";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  name: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, name, ...inputProps }, ref) => {
    return (
      <div className={`form-field ${error ? "form-field-error" : ""}`}>
        <label htmlFor={name} className="form-field-label">
          {label}
        </label>
        <Input
          ref={ref}
          id={name}
          name={name}
          hasError={!!error}
          {...inputProps}
        />
        {error && (
          <div className="form-field-error-message">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                fill="currentColor"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
