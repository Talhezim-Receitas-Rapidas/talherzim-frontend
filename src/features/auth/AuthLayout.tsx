import { HelpCircle } from 'lucide-react';

import type { ReactNode } from 'react';

import { Logo } from '../../components/ui/Logo';

interface AuthLayoutProps {
  children: ReactNode;
  onNavigateHome?: () => void;
  onNavigateHelp?: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export function AuthLayout({
  children,
  onNavigateHome,
  onNavigateHelp,
  onNavigateTerms,
  onNavigatePrivacy,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink antialiased">
      {/* cabeçalho */}
      <header className="relative z-20 w-full shrink-0 border-b border-ink/10 bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8 lg:px-12">
          <button
            type="button"
            onClick={onNavigateHome}
            className="relative z-30 flex shrink-0 items-center outline-none"
          >
            <Logo className="h-10 w-auto shrink-0" />
          </button>

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
      </header>

      {/* conteúdo principal */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-8">
        <section className="w-full max-w-lg rounded-3xl border-2 border-ink bg-white p-6 shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:p-8 lg:p-10">
          {children}
        </section>
      </main>

      {/* rodapé */}
      <footer className="w-full shrink-0 border-t border-ink/10 bg-stone-field py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 sm:flex-row md:px-8 lg:px-12">
          <p className="text-xs text-stone-muted">
            © {new Date().getFullYear()}{' '}
            <span className="font-bold text-ink">
              Talherzin<span className="text-brand">.</span>
            </span>
          </p>

          <div className="flex items-center gap-5">
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
