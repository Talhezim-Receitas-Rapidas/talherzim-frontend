import type { ComponentType, ReactNode } from 'react';

import type { LucideProps } from 'lucide-react';

interface StatePanelProps {
  icon: ComponentType<LucideProps>;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function StatePanel({
  icon: Icon,
  title,
  children,
  action,
}: StatePanelProps) {
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border-2 border-ink bg-white px-6 py-12 text-center shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:px-10">
      <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-cream-badge text-brand">
        <Icon
          className="h-8 w-8"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>

      <h2 className="text-xl font-black tracking-tight sm:text-2xl">
        {title}
      </h2>

      <div className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-muted">
        {children}
      </div>

      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}