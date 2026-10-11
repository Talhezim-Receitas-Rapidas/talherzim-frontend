
import {
    ArrowRight,
    PackageOpen,
    Plus,
    Pencil,
    RefreshCw,
    Search,
    Trash2,
    WifiOff,
  } from 'lucide-react';
  import { useMemo, useState } from 'react';
  import { AxiosError } from 'axios';
  
  import { Button } from '../../components/ui/Button';
  import { FormError } from '../../components/ui/FormError';
  
  import { RecipesHeader } from '../receitas/RecipesHeader';
  import { StatePanel } from '../receitas/StatePanel';
  import { Check } from 'lucide-react';
  
  import { IngredientForm } from './IngredientForm';
  import type { DespensaFormData } from './despensaSchema';
  import type { Ingrediente } from './despensaService';
  
  import {
    useAtualizarIngrediente,
    useCadastrarIngrediente,
    useIngredientes,
    useRemoverIngrediente,
  } from './useDespensa';
  
  interface DespensaPageProps {
    onNavigateTerms?: () => void;
    onNavigatePrivacy?: () => void;
    onNavigateHelp?: () => void;
  }
  
  interface ApiError {
    erro?: string;
    campos?: Array<{
      campo: string;
      mensagem: string;
    }>;
  }
  
  function IngredientSkeleton() {
    return (
      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[4px_4px_0px_0px_theme(colors.ink)]">
        <div className="flex items-center gap-4 p-5">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-stone-field" />
  
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded-lg bg-stone-field" />
            <div className="h-4 w-1/3 animate-pulse rounded-lg bg-stone-field" />
          </div>
        </div>
      </div>
    );
  }
  
  function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      const data = error.response?.data as ApiError | undefined;
  
      if (data?.campos?.length) {
        return data.campos.map((campo) => campo.mensagem).join(' ');
      }
  
      const messages: Record<string, string> = {
        nao_autenticado: 'Sua sessão expirou. Entre novamente.',
        token_invalido: 'Sua sessão é inválida. Entre novamente.',
        dados_invalidos: 'Confira os dados informados.',
      };
  
      if (data?.erro && messages[data.erro]) {
        return messages[data.erro];
      }
    }
  
    return 'Não foi possível concluir a operação. Tente novamente.';
  }
  
  function formatQuantity(quantity: number) {
    return new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 3,
    }).format(quantity);
  }
  
  const unitLabels: Record<Ingrediente['unidade'], string> = {
    un: 'un',
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'L',
  };
  
  export function DespensaPage({
    onNavigateTerms,
    onNavigatePrivacy,
    onNavigateHelp,
  }: DespensaPageProps) {
    const {
      data: ingredientes = [],
      isLoading,
      isError,
      refetch,
    } = useIngredientes();
  
    const cadastrar = useCadastrarIngrediente();
    const atualizar = useAtualizarIngrediente();
    const remover = useRemoverIngrediente();
  
    const [search, setSearch] = useState('');
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [ingredienteEditando, setIngredienteEditando] =
      useState<Ingrediente | null>(null);
    const [erroOperacao, setErroOperacao] = useState('');
    const [sucesso, setSucesso] = useState('');
  
    const enviando = cadastrar.isPending || atualizar.isPending;
  
    const filteredIngredients = useMemo(() => {
      const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
  
      if (!normalizedSearch) {
        return ingredientes;
      }
  
      return ingredientes.filter((ingrediente) =>
        ingrediente.nome.toLocaleLowerCase('pt-BR').includes(normalizedSearch),
      );
    }, [ingredientes, search]);
  
    function abrirCadastro() {
      setIngredienteEditando(null);
      setErroOperacao('');
      setSucesso('');
      setFormularioAberto(true);
    }
  
    function abrirEdicao(ingrediente: Ingrediente) {
      setIngredienteEditando(ingrediente);
      setErroOperacao('');
      setSucesso('');
      setFormularioAberto(true);
    }
  
    function fecharFormulario() {
      setFormularioAberto(false);
      setIngredienteEditando(null);
    }
  
    async function salvar(values: DespensaFormData) {
      setErroOperacao('');
      setSucesso('');
  
      try {
        if (ingredienteEditando) {
          await atualizar.mutateAsync({
            id: ingredienteEditando.id,
            payload: values,
          });
          setSucesso('Ingrediente atualizado com sucesso.');
        } else {
          await cadastrar.mutateAsync(values);
          setSucesso('Ingrediente adicionado à despensa.');
        }
  
        fecharFormulario();
      } catch (error) {
        setErroOperacao(getErrorMessage(error));
      }
    }
  
    async function excluir(ingrediente: Ingrediente) {
      const confirmado = window.confirm(
        `Deseja remover "${ingrediente.nome}" da despensa?`,
      );
  
      if (!confirmado) return;
  
      setErroOperacao('');
      setSucesso('');
  
      try {
        await remover.mutateAsync(ingrediente.id);
        setSucesso(`${ingrediente.nome} foi removido da despensa.`);
      } catch (error) {
        setErroOperacao(getErrorMessage(error));
      }
    }
  
    return (
      <div className="min-h-screen bg-cream text-ink antialiased">
        <RecipesHeader
          activePage="despensa"
          onNavigateHelp={onNavigateHelp}
        />
  
        <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mb-7 flex items-center justify-between gap-6">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
                Organização da cozinha
              </p>
  
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Minha Despensa
              </h1>
  
              <p className="mt-2 text-sm text-stone-muted">
                Gerencie seus ingredientes e prepare-se para novas receitas.
                <span className="px-1.5 text-brand">•</span>
                <strong className="text-brand">
                  {isLoading
                    ? '…'
                    : `${ingredientes.length} ${
                        ingredientes.length === 1 ? 'ingrediente' : 'ingredientes'
                      }`}
                </strong>
              </p>
            </div>
  
           <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-cream-badge text-ink shadow-[2px_2px_0px_0px_theme(colors.ink)]">
              <PackageOpen
                className="h-7 w-7 text-brand"
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>
          </div>
  
          {sucesso && (
            <div
              role="status"
              className="mb-5 rounded-xl border-2 border-ink bg-cream-badge p-3 text-sm font-semibold"
            >
              {sucesso}
            </div>
          )}
  
          {erroOperacao && (
            <div className="mb-5 rounded-xl border-2 border-danger bg-white p-3">
              <FormError message={erroOperacao} />
            </div>
          )}
  
          {formularioAberto && (
            <section className="mb-7 rounded-3xl border-2 border-ink bg-white p-5 shadow-[4px_4px_0px_0px_theme(colors.ink)] sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
                    {ingredienteEditando ? 'Atualização' : 'Novo item'}
                  </p>
  
                  <h2 className="text-xl font-black tracking-tight">
                    {ingredienteEditando
                      ? 'Editar ingrediente'
                      : 'Adicionar à despensa'}
                  </h2>
                </div>
  
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-cream-badge">
                  <Plus className="h-5 w-5 text-brand" aria-hidden="true" />
                </span>
              </div>
  
              <IngredientForm
                ingrediente={ingredienteEditando}
                isSubmitting={enviando}
                onSubmit={salvar}
                onCancel={fecharFormulario}
              />
            </section>
          )}
  
          {!formularioAberto && (
            <div className="mb-7 flex justify-end">
              <Button
                type="button"
                fullWidth={false}
                onClick={abrirCadastro}
              >
                <span className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Adicionar ingrediente
                </span>
              </Button>
            </div>
          )}
  
          <label className="mb-7 flex h-14 w-full items-center gap-3 rounded-2xl border-2 border-ink bg-white px-4 shadow-[3px_3px_0px_0px_theme(colors.ink)] focus-within:border-brand">
            <Search
              className="h-5 w-5 shrink-0 text-stone-muted"
              strokeWidth={2}
              aria-hidden="true"
            />
  
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar ingredientes..."
              aria-label="Buscar ingredientes"
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
  
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <IngredientSkeleton key={item} />
              ))}
            </div>
          ) : isError ? (
            <StatePanel
              icon={WifiOff}
              title="Não conseguimos carregar sua despensa"
              action={
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)]"
                >
                  Tentar novamente
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                </button>
              }
            >
              Verifique sua conexão e tente novamente.
            </StatePanel>
          ) : ingredientes.length === 0 ? (
            <StatePanel
              icon={PackageOpen}
              title="Sua despensa ainda está vazia"
              action={
                <button
                  type="button"
                  onClick={abrirCadastro}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0px_0px_theme(colors.ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[5px_5px_0px_0px_theme(colors.ink)]"
                >
                  Cadastrar ingredientes
                  <ArrowRight
                    className="h-4 w-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>
              }
            >
              Adicione os ingredientes que você já tem em casa. Depois, use-os
              para encontrar receitas que combinam com a sua despensa.
            </StatePanel>
          ) : filteredIngredients.length === 0 ? (
            <StatePanel icon={Search} title="Nenhum ingrediente encontrado">
              Tente buscar por outro nome ou limpe o campo de pesquisa.
            </StatePanel>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredIngredients.map((ingrediente) => (
              
            <article
            key={ingrediente.id}
            className="group relative overflow-hidden rounded-3xl border-2 border-ink bg-[#FFF7E6] p-5 shadow-[4px_4px_0px_0px_theme(colors.ink)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_theme(colors.ink)]"
            >
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-cream-badge  text-ink shadow-[2px_2px_0px_0px_theme(colors.ink)]">
                <PackageOpen
                    className="h-6 w-6 text-brand"
                    strokeWidth={2}
                    aria-hidden="true"
                />
                </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-cream-badge px-3 py-1.5 text-xs font-extrabold text-ink">
            <Check
                className="h-3.5 w-3.5 text-brand"
                strokeWidth={2.5}
                aria-hidden="true"
            />
            Na despensa
            </span>
            </div>

            <div className="mt-5">
                <h2 className="break-words text-xl font-black leading-tight tracking-tight text-ink">
                {ingrediente.nome}
                </h2>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-stone-muted">
                Quantidade disponível
                </p>

                <p className="mt-1 text-2xl font-black tracking-tight text-brand">
                {formatQuantity(ingrediente.quantidade)}{' '}
                <span className="text-base font-bold">
                    {unitLabels[ingrediente.unidade]}
                </span>
                </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t-2 border-ink/10 pt-4">
                <button
                type="button"
                onClick={() => abrirEdicao(ingrediente)}
                aria-label={`Editar ${ingrediente.nome}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2.5 text-xs font-extrabold text-ink shadow-[2px_2px_0px_0px_theme(colors.ink)] transition-all hover:-translate-y-0.5 hover:bg-[#F3DCA7] hover:shadow-[3px_3px_0px_0px_theme(colors.ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Editar
                </button>

                <button
                type="button"
                onClick={() => void excluir(ingrediente)}
                disabled={remover.isPending}
                aria-label={`Excluir ${ingrediente.nome}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2.5 text-xs font-extrabold text-danger shadow-[2px_2px_0px_0px_theme(colors.ink)] transition-all hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-[3px_3px_0px_0px_theme(colors.ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {remover.isPending ? 'Excluindo...' : 'Excluir'}
                </button>
            </div>
            </article>

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
  