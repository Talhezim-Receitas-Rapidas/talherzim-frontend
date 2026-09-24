import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'social';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: ReactNode;
}

const base =
  'relative inline-flex select-none items-center justify-center gap-2 border-2 border-ink font-extrabold outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-full bg-brand px-6 py-3.5 text-base tracking-wide text-white shadow-[4px_4px_0px_0px_theme(colors.ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[6px_6px_0px_0px_theme(colors.ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_theme(colors.ink)]',

  secondary:
    'rounded-2xl bg-cream-soft px-5 py-3 text-sm text-ink shadow-[3px_3px_0px_0px_theme(colors.ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cream-badge hover:shadow-[5px_5px_0px_0px_theme(colors.ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_theme(colors.ink)]',

  outline:
    'rounded-2xl bg-transparent px-5 py-3 text-sm text-ink shadow-[3px_3px_0px_0px_theme(colors.ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-stone-field hover:shadow-[5px_5px_0px_0px_theme(colors.ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_theme(colors.ink)]',

  social:
    'rounded-full bg-white px-4 py-3 text-sm text-ink shadow-[4px_4px_0px_0px_theme(colors.ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-stone-field hover:shadow-[6px_6px_0px_0px_theme(colors.ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_theme(colors.ink)]',
};

export function Button({
  variant = 'primary',
  fullWidth = true,
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading && (
        <LoaderCircle
          className="h-5 w-5 animate-spin"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  );
}
