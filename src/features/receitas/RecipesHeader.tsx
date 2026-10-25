import { useState } from 'react';
import { Check, ChevronRight, CircleHelp, Star, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Logo } from '../../components/ui/Logo';

interface RecipesHeaderProps {
  activePage?: 'despensa' | 'receitas' | 'favoritos';
  onNavigateHelp?: () => void;
}

export function RecipesHeader({
  activePage = 'receitas',
  onNavigateHelp,
}: RecipesHeaderProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  const isDespensa = activePage === 'despensa';
  const isReceitas = activePage === 'receitas';
  const isFavoritos = activePage === 'favoritos';

  const linkBase =
    'flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-colors';

  const linkAtivo =
    'border-ink bg-brand text-white shadow-[3px_3px_0px_0px_theme(colors.ink)]';

  const linkInativo =
    'border-transparent text-stone-muted hover:border-ink/20 hover:bg-cream';

  const fecharMenu = () => setMenuAberto(false);

  const linkDesktop = (ativo: boolean) =>
    ativo
      ? 'rounded-full border-2 border-ink bg-brand px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]'
      : 'rounded-full px-4 py-2 text-xs font-bold text-stone-muted transition-colors hover:text-ink';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink/10 bg-cream/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-12">
        <Link
          to="/receitas-sugeridas"
          className="flex shrink-0 items-center"
          aria-label="Talherzim - página inicial"
          onClick={fecharMenu}
        >
          <Logo className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-2 text-sm text-stone-muted md:flex">
          {isDespensa ? (
            <span className="font-bold text-ink">Minha Despensa</span>
          ) : (
            <>
              <Link to="/despensa" className="transition-colors hover:text-ink">
                Despensa
              </Link>

              <ChevronRight
                className="h-4 w-4"
                strokeWidth={2}
                aria-hidden="true"
              />

              <span className="font-bold text-ink">
                {isFavoritos ? 'Favoritos' : 'Receitas Sugeridas'}
              </span>
            </>
          )}
        </div>

        {/* Navegação desktop */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 rounded-full border-2 border-ink bg-white p-1 shadow-[2px_2px_0px_0px_theme(colors.ink)] lg:flex"
        >
          <Link
            to="/despensa"
            aria-current={isDespensa ? 'page' : undefined}
            className={linkDesktop(isDespensa)}
          >
            Minha Despensa
          </Link>

          <Link
            to="/receitas-sugeridas"
            aria-current={isReceitas ? 'page' : undefined}
            className={linkDesktop(isReceitas)}
          >
            Receitas Sugeridas
          </Link>

          <Link
            to="/favoritos"
            aria-current={isFavoritos ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 ${linkDesktop(isFavoritos)}`}
          >
            <Star
              className="h-3.5 w-3.5"
              fill={isFavoritos ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
            Favoritos
          </Link>
        </nav>

        {/* Ações do cabeçalho */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onNavigateHelp}
            className="flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-bold text-stone-muted transition-colors hover:bg-white hover:text-ink sm:px-3"
            aria-label="Ajuda"
          >
            <CircleHelp
              className="h-5 w-5"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Ajuda</span>
          </button>

          {/* Botão do menu mobile */}
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-white shadow-[2px_2px_0px_0px_theme(colors.ink)] transition-transform hover:-translate-y-0.5 lg:hidden"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="mobile-navigation"
          >
            {menuAberto ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div
          id="mobile-navigation"
          className="border-t-2 border-ink bg-cream px-4 py-4 shadow-[0px_1px_0px_0px_theme(colors.ink)] lg:hidden sm:px-6"
        >
          <nav
            aria-label="Navegação mobile"
            className="mx-auto flex max-w-7xl flex-col gap-2"
          >
            <p className="px-2 pb-1 text-xs font-bold uppercase tracking-wider text-stone-muted">
              MENU PRINCIPAL
            </p>

            <Link
              to="/despensa"
              onClick={fecharMenu}
              aria-current={isDespensa ? 'page' : undefined}
              className={`${linkBase} ${isDespensa ? linkAtivo : linkInativo}`}
            >
              <span>Minha Despensa</span>
              {isDespensa && <Check className="h-4 w-4" aria-hidden="true" />}
            </Link>

            <Link
              to="/receitas-sugeridas"
              onClick={fecharMenu}
              aria-current={isReceitas ? 'page' : undefined}
              className={`${linkBase} ${isReceitas ? linkAtivo : linkInativo}`}
            >
              <span>Receitas Sugeridas</span>
              {isReceitas && <Check className="h-4 w-4" aria-hidden="true" />}
            </Link>

            <Link
              to="/favoritos"
              onClick={fecharMenu}
              aria-current={isFavoritos ? 'page' : undefined}
              className={`${linkBase} ${isFavoritos ? linkAtivo : linkInativo}`}
            >
              <span>Favoritos</span>
              {isFavoritos ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Star className="h-4 w-4" fill="none" aria-hidden="true" />
              )}
            </Link>

            {onNavigateHelp && (
              <button
                type="button"
                onClick={() => {
                  fecharMenu();
                  onNavigateHelp();
                }}
                className={`${linkBase} ${linkInativo} w-full text-left`}
              >
                <span>Ajuda e suporte</span>
                <CircleHelp className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
