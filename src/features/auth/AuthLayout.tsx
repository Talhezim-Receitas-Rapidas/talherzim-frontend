import { CircleCheck, HelpCircle, Utensils } from 'lucide-react';

import type { ReactNode } from 'react';

import { Logo } from '../../components/ui/Logo';

export interface AuthHeroContent {
  badge: string;
  title: string;
  description: string;
  statPrimaryNumber: string;
  statPrimaryLabel: string;
  statSecondaryNumber: string;
  statSecondaryLabel: string;
  featureTitle: string;
  featureDescription: string;
}

interface AuthLayoutProps {
  children: ReactNode;
  hero: AuthHeroContent;
  onNavigateHome?: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export function AuthLayout({
  children,
  hero,
  onNavigateHome,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-cream text-ink antialiased">
      {/* cabeçalho */}
      <header className="relative z-20 w-full overflow-visible border-b border-ink/10 bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8 lg:px-12">
          <button
            type="button"
            onClick={onNavigateHome}
            className="relative z-30 flex shrink-0 items-center outline-none"
          >
            <Logo className="h-12 w-auto shrink-0" />
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-stone-muted sm:inline">
              Cozinhe com o que você tem
            </span>

            <button
              type="button"
              onClick={onNavigateHelp}
              className="flex items-center gap-1.5 text-sm font-bold text-stone-muted transition-colors hover:text-ink"
            >
              <HelpCircle
                className="h-4 w-4"
                strokeWidth={2}
                aria-hidden="true"
              />
              Ajuda
            </button>
          </div>
        </div>
      </header>

      {/* conteúdo principal */}
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:py-12">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* apresentação */}
          <div className="order-2 flex flex-col justify-between gap-6 lg:order-1 lg:col-span-5">
            {/* card principal */}
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border-2 border-ink bg-cream-soft p-6 shadow-[6px_6px_0px_0px_theme(colors.ink)] md:p-8">
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-cream-badge opacity-60" />

              <div className="relative z-10 flex flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-brand px-4 py-1.5 text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {hero.badge}
                  </span>
                </span>

                <div className="space-y-4">
                  <h2 className="text-2xl font-extrabold leading-snug sm:text-3xl">
                    {hero.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-stone-body md:text-base">
                    {hero.description}
                  </p>
                </div>
              </div>

              {/* estatísticas */}
              <div className="mt-6 grid grid-cols-2 items-stretch gap-4 border-t-2 border-ink/15 pt-8">
                <StatCard
                  number={hero.statPrimaryNumber}
                  label={hero.statPrimaryLabel}
                />

                <StatCard
                  number={hero.statSecondaryNumber}
                  label={hero.statSecondaryLabel}
                />
              </div>
            </div>

            {/* destaque */}
            <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-white p-4 shadow-[4px_4px_0px_0px_theme(colors.ink)]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-brand text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]">
                <CircleCheck
                  className="h-7 w-7"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-bold">{hero.featureTitle}</p>

                <p className="text-xs text-stone-muted">
                  {hero.featureDescription}
                </p>
              </div>
            </div>
          </div>

          {/* formulário */}
          <div className="order-1 flex flex-col lg:order-2 lg:col-span-7">
            <div className="relative flex h-full flex-col justify-center rounded-3xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0px_0px_theme(colors.ink)] sm:p-10">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* rodapé */}
      <footer className="w-full border-t border-ink/10 bg-stone-field py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row md:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-brand text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]">
              <Utensils
                className="h-5 w-5"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <span className="text-sm font-bold text-ink">
              Menos desperdício, mais sabor
              <span className="text-brand">.</span>
            </span>
          </div>

          <p className="text-xs text-stone-muted">
            © {new Date().getFullYear()}{' '}
            <span className="font-bold text-ink">
              Talherzim<span className="text-brand">.</span>
            </span>
          </p>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onNavigateTerms}
              className="text-xs text-stone-muted transition-colors hover:text-ink"
            >
              Termos de Uso
            </button>

            <button
              type="button"
              onClick={onNavigatePrivacy}
              className="text-xs text-stone-muted transition-colors hover:text-ink"
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex h-full min-h-24 w-full flex-col justify-center rounded-2xl border-2 border-ink bg-white p-3 shadow-[3px_3px_0px_0px_theme(colors.ink)]">
      <span className="block text-2xl font-extrabold text-brand">{number}</span>

      <span className="text-xs font-medium text-stone-muted">{label}</span>
    </div>
  );
}
