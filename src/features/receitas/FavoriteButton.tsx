import { Bookmark } from 'lucide-react';

import { useFavoritos } from './favoritosService';

interface FavoriteButtonProps {
  receitaId: string;
  className?: string;
}

export function FavoriteButton({
  receitaId,
  className = '',
}: FavoriteButtonProps) {
  const { ehFavorita, alternarFavorito } = useFavoritos();
  const favorita = ehFavorita(receitaId);

  return (
    <button
      type="button"
      aria-label={favorita ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      aria-pressed={favorita}
      title={favorita ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
          alternarFavorito(receitaId);
        } catch (error) {
          console.error(error);
        }
      }}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white shadow-[2px_2px_0px_0px_theme(colors.ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      <Bookmark
        className={`h-5 w-5 ${favorita ? 'fill-brand text-ink' : 'text-ink'}`}
        aria-hidden="true"
      />
    </button>
  );
}
