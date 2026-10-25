import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Star,
  LoaderCircle,
  RefreshCw,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { RecipesHeader } from './RecipesHeader';
import { FavoriteButton } from './FavoriteButton';
import { useFavoritos } from './favoritosService';
import { buscarReceita, FALLBACK_IMAGE } from './receitaService';

export function FavoritesPage() {
  const { ids, quantidade } = useFavoritos();

  const favoritosQuery = useQuery({
    queryKey: ['receitas-favoritas', ids],
    queryFn: async () => {
      const resultados = await Promise.all(ids.map((id) => buscarReceita(id)));

      return resultados;
    },
    enabled: ids.length > 0,
    retry: false,
  });

  const receitas = favoritosQuery.data ?? [];

  return (
    <div className="min-h-screen bg-cream text-ink">
      <RecipesHeader activePage="favoritos" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-12">
        <section className="mb-8 flex items-start gap-4 sm:mb-10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-brand shadow-[3px_3px_0px_0px_theme(colors.ink)]">
            <Star
              className="h-7 w-7 fill-white text-white"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-stone-muted">
              Sua coleção pessoal
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Minhas favoritas
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-muted sm:text-base">
              Suas receitas preferidas reunidas em um só lugar, prontas para
              preparar quando quiser.
            </p>

            <p className="mt-3 text-sm font-bold">
              {quantidade}{' '}
              {quantidade === 1 ? 'receita salva' : 'receitas salvas'}
            </p>
          </div>
        </section>

        {/* Carregamento */}
        {quantidade > 0 && favoritosQuery.isPending && (
          <div
            role="status"
            className="flex min-h-56 flex-col items-center justify-center gap-3"
          >
            <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium text-stone-muted">
              Carregando suas receitas...
            </p>
          </div>
        )}

        {/* Erro */}
        {quantidade > 0 && favoritosQuery.isError && (
          <div
            role="alert"
            className="rounded-3xl border-2 border-ink bg-white p-6 text-center shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:p-10"
          >
            <RefreshCw className="mx-auto mb-4 h-8 w-8" />

            <h2 className="text-xl font-black">
              Não foi possível carregar suas receitas
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-muted">
              Verifique sua conexão e tente novamente. Seus favoritos continuam
              salvos neste dispositivo.
            </p>

            <button
              type="button"
              onClick={() => favoritosQuery.refetch()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand px-5 py-3 text-sm font-bold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-transform hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {/* Lista vazia */}
        {quantidade === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-ink/30 bg-[#FFF7E6] px-5 py-12 text-center sm:px-10 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0px_0px_theme(colors.ink)]">
              <Star className="h-8 w-8" aria-hidden="true" />
            </div>

            <h2 className="mt-6 text-xl font-black sm:text-2xl">
              Sua coleção começa aqui
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-muted">
              Você ainda não salvou nenhuma receita. Explore as sugestões e
              toque na estrela das suas preferidas.
            </p>

            <Link
              to="/receitas-sugeridas"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand px-5 py-3 text-sm font-bold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-transform hover:-translate-y-0.5"
            >
              Explorar receitas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Receitas favoritas */}
        {!favoritosQuery.isPending &&
          !favoritosQuery.isError &&
          receitas.length > 0 && (
            <section
              aria-label="Lista de receitas favoritas"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {receitas.map((receita) => (
                <article
                  key={receita.id}
                  className="group overflow-hidden rounded-3xl border-2 border-ink bg-[#FFF7E6] shadow-[4px_4px_0px_0px_theme(colors.ink)] transition-transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <Link
                      to={`/receitas/${encodeURIComponent(receita.id)}`}
                      aria-label={`Ver receita ${receita.nome}`}
                      className="block"
                    >
                      <img
                        src={receita.imagem || FALLBACK_IMAGE}
                        alt={receita.nome}
                        loading="lazy"
                        onError={(event) => {
                          const img = event.currentTarget;

                          if (img.dataset.fallbackApplied) return;

                          img.dataset.fallbackApplied = 'true';
                          img.src = FALLBACK_IMAGE;
                        }}
                        className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </Link>

                    <div className="absolute right-3 top-3">
                      <FavoriteButton receitaId={receita.id} />
                    </div>
                  </div>

                  <div className="p-5">
                    <Link
                      to={`/receitas/${encodeURIComponent(receita.id)}`}
                      className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      <h2 className="line-clamp-2 text-lg font-black">
                        {receita.nome}
                      </h2>

                      {receita.descricao && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-muted">
                          {receita.descricao}
                        </p>
                      )}
                    </Link>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-stone-muted">
                        <Utensils className="h-4 w-4" aria-hidden="true" />
                        {receita.totalIngredientes}{' '}
                        {receita.totalIngredientes === 1
                          ? 'ingrediente'
                          : 'ingredientes'}
                      </span>

                      <Link
                        to={`/receitas/${encodeURIComponent(receita.id)}`}
                        className="inline-flex items-center gap-1 text-sm font-black transition-colors hover:text-brand-hover"
                      >
                        Ver receita
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}
