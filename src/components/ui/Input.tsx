import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { FormError } from './FormError';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  isPassword?: boolean;
  rightIcon?: ReactNode;
  labelAside?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    error,
    isPassword = false,
    rightIcon,
    labelAside,
    type = 'text',
    className = '',
    ...props
  },
  ref,
) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const errorId = `${id}-error`;

  const resolvedType = isPassword
    ? passwordVisible
      ? 'text'
      : 'password'
    : type;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-bold text-ink">
          {label}
        </label>

        {labelAside}
      </div>

      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-2xl border-2 bg-stone-field px-4 py-3 text-sm text-ink outline-none transition-all duration-150 placeholder:text-stone-placeholder disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-danger shadow-[3px_3px_0px_0px_theme(colors.danger)] focus:shadow-[4px_4px_0px_0px_theme(colors.danger)]'
              : 'border-ink shadow-[3px_3px_0px_0px_theme(colors.ink)] focus:border-brand-focus focus:shadow-[4px_4px_0px_0px_theme(colors.brand-focus)]'
          } ${isPassword || rightIcon ? 'pr-12' : ''} ${className}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? 'Ocultar senha' : 'Exibir senha'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-muted transition-colors hover:text-ink"
          >
            {passwordVisible ? (
              <EyeOff className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        ) : rightIcon ? (
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-muted">
            {rightIcon}
          </div>
        ) : null}
      </div>

      <FormError id={errorId} message={error} />
    </div>
  );
});
