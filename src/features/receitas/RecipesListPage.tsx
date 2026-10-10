import {
    ArrowLeft,
    ArrowRight,
    ChefHat,
    Search,
    WifiOff,
  } from 'lucide-react';
  import { useEffect, useMemo, useState } from 'react';
  import { Link } from 'react-router-dom';
  
  import { RecipeCard } from './RecipeCard';
  import { RecipesHeader } from './RecipesHeader';
  import {
    listarReceitasSugeridas,
    type Receita,
  } from './receitaService';
  import { StatePanel } from './StatePanel';
  
  interface RecipesListPageProps {
    onNavigateTerms?: () => void;
    onNavigatePrivacy?: () => void;
  }
  
  function RecipeSkeleton() {
    return (
      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[4px_4px_0px_0px_theme(colors.ink)]">
        <div className="h-52 animate-pulse bg-stone-field" />
  
        <div className="space-y-4 p-5">
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-stone-field" />
  
          <div className="h-12 animate-pulse rounded-lg bg-stone-field" />
  
          <div className="h-12 animate-pulse rounded-full bg-stone-field" />
        </div>
      </div>
    );
  }
  
  export function RecipesListPage({
    onNavigateTerms,
    onNavigatePrivacy,
  }: RecipesListPageProps) {
    const [recipes, setRecipes] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
  
    const load = () => {
      setLoading(true);
      setError('');
  
      listarReceitasSugeridas()
        .then(setRecipes)
        .catch((exception) => {
          setError(
            exception instanceof Error
              ? exception.message
              : 'Não foi possível carregar as receitas.',
          );
        })
        .finally(() => setLoading(false));
    };
  
    useEffect(() => {
      load();
    }, []);
  
    const filteredRecipes = useMemo(() => {
      const normalizedSearch = search.toLowerCase().trim();
  
      if (!normalizedSearch) {
        return recipes;
      }
  
      return recipes.filter((recipe) => {
        const ingredients = recipe.ingredientes
          .map((ingredient) =>
            typeof ingredient === 'string'
              ? ingredient
              : ingredient.nome,
          )
          .join(' ');
  
        return `${recipe.nome} ${ingredients}`
          .toLowerCase()
          .includes(normalizedSearch);
      });
    }, [recipes, search]);
  
    return (
      <div className="min-h-screen bg-cream text-ink antialiased">
        <RecipesHeader />
  
        <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mb-6">
            <Link
              to="/despensa"
              className="inline-flex items-center gap-2 text-sm font-bold text-stone-muted transition-colors hover:text-ink"
            >
              <ArrowLeft
                className="h-4 w-4"
                strokeWidth={2}
                aria-hidden="true"
              />
  
              Voltar para Minha Despensa
            </Link>
          </div>
  
          <div className="mb-7 flex items-center justify-between gap-6">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
                Ideias com o que você já tem
              </p>
  
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Receitas Sugeridas
              </h1>
  
              <p className="mt-2 text-sm text-stone-muted">
                Baseado no que você tem na despensa
  
                <span className="px-1.5 text-brand">•</span>
  
                <strong className="text-brand">
                  {loading
                    ? '…'
                    : `${recipes.length} ${
                        recipes.length === 1
                          ? 'receita apta'
                          : 'receitas aptas'
                      }`}
                </strong>
              </p>
            </div>
  
            <span className="hidden h-14 w-14 rotate-3 items-center justify-center rounded-2xl border-2 border-ink bg-cream-badge text-brand shadow-[2px_2px_0px_0px_theme(colors.ink)] sm:flex">
              <ChefHat
                className="h-7 w-7"
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>
          </div>
  
          <label className="mb-7 flex h-14 w-full items-center gap-3 rounded-2xl border-2 border-ink bg-white px-4 shadow-[3px_3px_0px_0px_theme(colors.ink)] focus-within:border-brand">
            <Search
              className="h-5 w-5 shrink-0 text-stone-muted"
              strokeWidth={2}
              aria-hidden="true"
            />
  
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar receitas ou ingredientes..."
              aria-label="Buscar receitas ou ingredientes"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-stone-placeholder"
            />
  
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="text-xl leading-none text-stone-muted transition-colors hover:text-ink"
              >
                ×
              </button>
            )}
          </label>
  
          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <RecipeSkeleton key={item} />
              ))}
            </div>
          ) : error ? (
            <StatePanel
              icon={WifiOff}
              title="Não conseguimos carregar as receitas"
              action={
                <button
                  type="button"
                  onClick={load}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)]"
                >
                  Tentar novamente
  
                  <ArrowRight
                    className="h-4 w-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>
              }
            >
              {error}
  
              <br />
  
              Confira sua conexão e tente novamente.
            </StatePanel>
          ) : recipes.length === 0 ? (
            <StatePanel
              icon={ChefHat}
              title="Sua despensa ainda está vazia"
              action={
                <Link
                  to="/despensa"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)]"
                >
                  Cadastrar ingredientes
  
                  <ArrowRight
                    className="h-4 w-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </Link>
              }
            >
              Adicione pelo menos 3 ingredientes à despensa para
              encontrarmos combinações gostosas para você.
            </StatePanel>
          ) : filteredRecipes.length === 0 ? (
            <StatePanel
              icon={Search}
              title="Nenhuma receita encontrada"
            >
              Tente buscar por outro nome ou ingrediente.
            </StatePanel>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                />
              ))}
            </div>
          )}
        </main>
  
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