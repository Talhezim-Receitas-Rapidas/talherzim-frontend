import { ArrowRight, Check, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { FavoriteButton } from './FavoriteButton';
import { FALLBACK_IMAGE, type Receita } from './receitaService';

interface RecipeCardProps {
  recipe: Receita;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const percentage = recipe.totalIngredientes
    ? Math.round((recipe.correspondencias / recipe.totalIngredientes) * 100)
    : 0;

  return (
    <article className="group relative overflow-hidden rounded-3xl border-2 border-ink bg-[#FFF7E6] shadow-[4px_4px_0px_0px_theme(colors.ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_theme(colors.ink)]">
      <div className="relative h-60 overflow-hidden bg-stone-field">
        <Link
          to={`/receitas/${encodeURIComponent(recipe.id)}`}
          aria-label={`Ver detalhes da receita ${recipe.nome}`}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        >
          <img
            src={recipe.imagem || FALLBACK_IMAGE}
            alt={recipe.nome}
            onError={(event) => {
              if (!event.currentTarget.dataset.fallback) {
                event.currentTarget.dataset.fallback = 'true';
                event.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-cream-badge px-3 py-1.5 text-[11px] font-extrabold text-ink shadow-[2px_2px_0px_0px_theme(colors.ink)]">
            <Check
              className="h-3.5 w-3.5 text-brand"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            {recipe.correspondencias}{' '}
            {recipe.correspondencias === 1 ? 'ingrediente' : 'ingredientes'}
          </span>

          {recipe.tempoPreparo != null && (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-[11px] font-bold text-ink shadow-[2px_2px_0px_0px_theme(colors.ink)]">
              <Clock3
                className="h-3.5 w-3.5 text-brand"
                strokeWidth={2}
                aria-hidden="true"
              />
              {recipe.tempoPreparo} min
            </span>
          )}
        </Link>

        {/* O botão fica fora do Link para evitar links aninhados. */}
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton receitaId={recipe.id} />
        </div>
      </div>

      <div className="flex min-h-48 flex-col p-5">
        <Link
          to={`/receitas/${encodeURIComponent(recipe.id)}`}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <h2 className="text-xl font-black leading-tight tracking-tight text-ink">
            {recipe.nome}
          </h2>
        </Link>

        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-stone-muted">
          {recipe.descricao ||
            `${percentage}% dos ingredientes desta receita já estão na sua despensa.`}
        </p>

        <div className="mt-5">
          <Link
            to={`/receitas/${encodeURIComponent(recipe.id)}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Ver receita
            <ArrowRight
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
