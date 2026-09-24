import { CircleAlert } from 'lucide-react';

interface FormErrorProps {
  id?: string;
  message?: string;
}

export function FormError({ id, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1 flex items-center gap-1 text-xs font-semibold text-danger"
    >
      <CircleAlert
        className="h-3.5 w-3.5 shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />

      {message}
    </p>
  );
}
