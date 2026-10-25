import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'talherzim:receitas-favoritas';
const FAVORITOS_VAZIOS: string[] = [];

let favoritosCache: string[] | null = null;

const listeners = new Set<() => void>();

function obterFavoritos(): string[] {
  if (favoritosCache !== null) {
    return favoritosCache;
  }

  if (typeof window === 'undefined') {
    return FAVORITOS_VAZIOS;
  }

  try {
    const armazenados = window.localStorage.getItem(STORAGE_KEY);
    const dados: unknown = armazenados ? JSON.parse(armazenados) : [];

    favoritosCache = Array.isArray(dados)
      ? [
          ...new Set(
            dados.filter((id: unknown): id is string => typeof id === 'string'),
          ),
        ]
      : [];
  } catch {
    favoritosCache = [];
  }

  return favoritosCache;
}

function notificarAlteracoes(): void {
  listeners.forEach((listener) => listener());
}

function assinar(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      favoritosCache = null;
      notificarAlteracoes();
    }
  });
}

export function listarIdsFavoritos(): string[] {
  return obterFavoritos();
}

export function ehFavorita(id: string): boolean {
  return obterFavoritos().includes(id);
}

export function alternarFavorito(id: string): boolean {
  const favoritos = obterFavoritos();
  const jaExiste = favoritos.includes(id);

  const atualizados = jaExiste
    ? favoritos.filter((favoritoId) => favoritoId !== id)
    : [...favoritos, id];

  if (typeof window === 'undefined') {
    throw new Error('Favoritos indisponíveis neste ambiente.');
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
  } catch {
    throw new Error(
      'Não foi possível salvar seus favoritos neste dispositivo.',
    );
  }

  favoritosCache = atualizados;
  notificarAlteracoes();

  return !jaExiste;
}

export function useFavoritos() {
  const ids = useSyncExternalStore(
    assinar,
    obterFavoritos,
    () => FAVORITOS_VAZIOS,
  );

  return {
    ids,
    quantidade: ids.length,
    ehFavorita,
    alternarFavorito,
  };
}
