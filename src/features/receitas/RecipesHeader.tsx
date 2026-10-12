
import { ChevronRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Logo } from '../../components/ui/Logo';

interface RecipesHeaderProps {
  activePage?: 'despensa' | 'receitas';
  onNavigateHelp?: () => void;
}

export function RecipesHeader({
  activePage = 'receitas',
  onNavigateHelp,
}: RecipesHeaderProps) {
  const isDespensa = activePage === 'despensa';

  return (
    <header className="sticky top-0 z-20 w-full border-b border-ink/10 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 md:px-8 lg:px-12">
        <Link
          to="/receitas-sugeridas"
          className="flex shrink-0 items-center"
          aria-label="Talherzim"
        >
          <Logo className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-2 text-sm text-stone-muted md:flex">
          {isDespensa ? (
            <span className="font-bold text-ink">Minha Despensa</span>
          ) : (
            <>
              <Link
                to="/despensa"
                className="transition-colors hover:text-ink"
              >
                Despensa
              </Link>

              <ChevronRight
                className="h-4 w-4"
                strokeWidth={2}
                aria-hidden="true"
              />

              <span className="font-bold text-ink">
                Receitas Sugeridas
              </span>
            </>
          )}
        </div>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 rounded-full border-2 border-ink bg-white p-1 shadow-[2px_2px_0px_0px_theme(colors.ink)] lg:flex"
        >
          <Link
            to="/despensa"
            aria-current={isDespensa ? 'page' : undefined}
            className={
              isDespensa
                ? 'rounded-full border-2 border-ink bg-brand px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]'
                : 'rounded-full px-4 py-2 text-xs font-bold text-stone-muted transition-colors hover:text-ink'
            }
          >
            Minha Despensa
          </Link>

          <Link
            to="/receitas-sugeridas"
            aria-current={!isDespensa ? 'page' : undefined}
            className={
              !isDespensa
                ? 'rounded-full border-2 border-ink bg-brand px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]'
                : 'rounded-full px-4 py-2 text-xs font-bold text-stone-muted transition-colors hover:text-ink'
            }
          >
            Receitas Sugeridas
          </Link>

          <a
            href="#favoritos"
            className="rounded-full px-4 py-2 text-xs font-bold text-stone-muted transition-colors hover:text-ink"
          >
            Favoritos
          </a>
        </nav>

        <button
          type="button"
          onClick={onNavigateHelp}
          className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-stone-muted transition-colors hover:text-ink"
        >
          <HelpCircle
            className="h-4 w-4"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">Ajuda</span>
        </button>
      </div>
    </header>
  );
}
