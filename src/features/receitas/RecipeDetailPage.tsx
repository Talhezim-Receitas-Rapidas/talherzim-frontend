import {
  ArrowLeft,
  ChefHat,
  Clock3,
  CookingPot,
  LoaderCircle,
  RefreshCw,
  Utensils,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { RecipesHeader } from './RecipesHeader';
import {
  buscarReceita,
  FALLBACK_IMAGE,
  ReceitaApiError,
  type ReceitaIngrediente,
  type ReceitaModoPreparo,
} from './receitaService';

function nomeIngrediente(ingrediente: string | ReceitaIngrediente): string {
  return typeof ingrediente === 'string' ? ingrediente : ingrediente.nome;
}

function quantidadeIngrediente(
  ingrediente: string | ReceitaIngrediente,
): string | undefined {
  return typeof ingrediente === 'string' ? undefined : ingrediente.quantidade;
}

function textoEtapa(etapa: string | ReceitaModoPreparo): string {
  return typeof etapa === 'string'
    ? etapa
    : etapa.descricao || etapa.texto || '';
}

function formatarErro(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Não foi possível carregar a receita. Tente novamente.';
}

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: receita,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['receita', id],
    queryFn: () => buscarReceita(id!),
    enabled: Boolean(id),
    retry: (failureCount, queryError) => {
      if (queryError instanceof ReceitaApiError && queryError.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });

  const receitaNaoEncontrada =
    error instanceof ReceitaApiError && error.status === 404;

  function voltarParaReceitas() {
    navigate('/receitas');
  }

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <RecipesHeader activePage="receitas" />

      <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
        <button
          type="button"
          onClick={voltarParaReceitas}
          className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2.5 text-sm font-extrabold shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-y-0.5 hover:bg-cream-badge hover:shadow-[4px_4px_0px_0px_theme(colors.ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar às receitas
        </button>

        {isPending && id ? (
          <section
            role="status"
            aria-live="polite"
            className="rounded-3xl border-2 border-ink bg-white p-8 text-center shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:p-12"
          >
            <LoaderCircle
              className="mx-auto h-10 w-10 animate-spin text-brand"
              aria-hidden="true"
            />
            <h1 className="mt-4 text-xl font-black">Carregando receita...</h1>
            <p className="mt-2 text-sm text-stone-muted">
              Estamos buscando os ingredientes e o modo de preparo.
            </p>
          </section>
        ) : !id || isError || !receita ? (
          <section
            role="alert"
            className="rounded-3xl border-2 border-ink bg-white px-6 py-10 text-center shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:px-12 sm:py-14"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-orange-200 shadow-[3px_3px_0px_0px_theme(colors.ink)]">
              <CookingPot className="h-8 w-8" aria-hidden="true" />
            </span>

            <h1 className="mt-5 text-2xl font-black tracking-tight">
              {!id || receitaNaoEncontrada
                ? 'Receita não encontrada'
                : 'Não foi possível carregar a receita'}
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-muted">
              {!id || receitaNaoEncontrada
                ? 'Essa receita não existe ou não está mais disponível. Volte à listagem para escolher outra.'
                : formatarErro(error)}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {id && !receitaNaoEncontrada && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  Tentar novamente
                </button>
              )}

              <button
                type="button"
                onClick={voltarParaReceitas}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-3 text-sm font-extrabold shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-y-0.5 hover:bg-cream-badge"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Ver receitas
              </button>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[4px_4px_0px_0px_theme(colors.ink)]">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative min-h-64 bg-cream-badge sm:min-h-80 lg:min-h-[420px]">
                  <img
                    src={receita.imagem || FALLBACK_IMAGE}
                    alt={receita.nome}
                    onError={(event) => {
                      if (!event.currentTarget.dataset.fallback) {
                        event.currentTarget.dataset.fallback = 'true';
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {receita.tempoPreparo != null && (
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-[3px_3px_0px_0px_theme(colors.ink)]">
                      <Clock3
                        className="h-4 w-4 text-brand"
                        aria-hidden="true"
                      />
                      {receita.tempoPreparo} min
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
                  <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-brand">
                    <ChefHat className="h-4 w-4" aria-hidden="true" />
                    Vamos cozinhar?
                  </p>

                  <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                    {receita.nome}
                  </h1>

                  {receita.descricao && (
                    <p className="mt-4 text-sm leading-7 text-stone-muted sm:text-base">
                      {receita.descricao}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream-badge px-4 py-2 text-sm font-bold">
                      <Utensils
                        className="h-4 w-4 text-brand"
                        aria-hidden="true"
                      />
                      {receita.ingredientes.length}{' '}
                      {receita.ingredientes.length === 1
                        ? 'ingrediente'
                        : 'ingredientes'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border-2 border-ink bg-white p-5 shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink bg-orange-200">
                  <Utensils className="h-5 w-5" aria-hidden="true" />
                </span>

                <div>
                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    Ingredientes
                  </h2>
                  <p className="mt-0.5 text-sm text-stone-muted">
                    Separe tudo antes de começar.
                  </p>
                </div>
              </div>

              {receita.ingredientes.length > 0 ? (
                <ul className="divide-y-2 divide-ink/10">
                  {receita.ingredientes.map((ingrediente, index) => {
                    const nome = nomeIngrediente(ingrediente);
                    const quantidade = quantidadeIngrediente(ingrediente);

                    return (
                      <li
                        key={`${nome}-${index}`}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <span className="flex min-w-0 items-start gap-3 text-sm font-semibold sm:text-base">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-cream-badge">
                            <span className="h-2 w-2 rounded-sm bg-brand" />
                          </span>
                          <span className="break-words">{nome}</span>
                        </span>

                        {quantidade && (
                          <span className="shrink-0 rounded-lg bg-cream-badge px-3 py-1.5 text-right text-xs font-extrabold text-ink sm:text-sm">
                            {quantidade}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="rounded-2xl border-2 border-dashed border-ink/20 bg-cream p-5 text-sm text-stone-muted">
                  Os ingredientes ainda não foram informados para esta receita.
                </p>
              )}
            </section>

            <section className="rounded-3xl border-2 border-ink bg-white p-5 shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink bg-orange-200">
                  <ChefHat className="h-5 w-5" aria-hidden="true" />
                </span>

                <div>
                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    Modo de preparo
                  </h2>
                  <p className="mt-0.5 text-sm text-stone-muted">
                    Siga as etapas para preparar sua receita.
                  </p>
                </div>
              </div>

              {receita.modoPreparo.length > 0 ? (
                <ol className="space-y-5">
                  {receita.modoPreparo.map((etapa, index) => {
                    const texto = textoEtapa(etapa);

                    if (!texto.trim()) return null;

                    return (
                      <li
                        key={`etapa-${index}`}
                        className="flex items-start gap-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-cream-badge text-sm font-black shadow-[2px_2px_0px_0px_theme(colors.ink)]">
                          {index + 1}
                        </span>

                        <p className="min-w-0 flex-1 pt-1 text-sm leading-7 text-ink sm:text-base">
                          {texto}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="rounded-2xl border-2 border-dashed border-ink/20 bg-cream p-5 text-sm text-stone-muted">
                  O modo de preparo ainda não foi informado para esta receita.
                </p>
              )}
            </section>

            <div className="flex justify-center pb-4">
              <button
                type="button"
                onClick={voltarParaReceitas}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Voltar a sua despensa
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
