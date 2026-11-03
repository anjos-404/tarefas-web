"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormNovaTarefa } from "@/components/FormNovaTarefa";
import { ItemTarefa } from "@/components/ItemTarefa";
import { api, type NovaTarefa, type Tarefa } from "@/lib/api";

type Filtro = "todas" | "pendentes" | "concluidas";

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "pendentes", rotulo: "Pendentes" },
  { valor: "concluidas", rotulo: "Concluídas" },
];

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setTarefas(await api.listar());
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível falar com a API.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function criar(dados: NovaTarefa) {
    try {
      const nova = await api.criar(dados);
      setTarefas((atual) => [nova, ...atual]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao criar a tarefa.");
    }
  }

  async function alternar(tarefa: Tarefa) {
    const alterada = { ...tarefa, concluida: !tarefa.concluida };
    setTarefas((atual) => atual.map((t) => (t.id === tarefa.id ? alterada : t)));
    try {
      await api.atualizar(alterada);
    } catch (e) {
      setTarefas((atual) => atual.map((t) => (t.id === tarefa.id ? tarefa : t)));
      setErro(e instanceof Error ? e.message : "Erro ao atualizar a tarefa.");
    }
  }

  async function remover(id: number) {
    const antes = tarefas;
    setTarefas((atual) => atual.filter((t) => t.id !== id));
    try {
      await api.remover(id);
    } catch (e) {
      setTarefas(antes);
      setErro(e instanceof Error ? e.message : "Erro ao remover a tarefa.");
    }
  }

  const visiveis = useMemo(
    () =>
      tarefas.filter((t) =>
        filtro === "todas" ? true : filtro === "pendentes" ? !t.concluida : t.concluida,
      ),
    [tarefas, filtro],
  );
  const pendentes = tarefas.filter((t) => !t.concluida).length;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <p className="text-black/60 dark:text-white/60">
          {pendentes} pendente{pendentes === 1 ? "" : "s"} de {tarefas.length}
        </p>
      </header>

      <FormNovaTarefa onCriar={criar} />

      <nav className="flex gap-2" aria-label="Filtrar tarefas">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            aria-pressed={filtro === f.valor}
            className={`rounded-full px-3 py-1 text-sm ${
              filtro === f.valor ? "bg-blue-600 text-white" : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {f.rotulo}
          </button>
        ))}
      </nav>

      {erro && (
        <div role="alert" className="flex items-center justify-between rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
          <span>{erro}</span>
          <button onClick={carregar} className="font-medium underline">
            Tentar de novo
          </button>
        </div>
      )}

      {carregando ? (
        <p className="text-black/60 dark:text-white/60">Carregando...</p>
      ) : visiveis.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">Nenhuma tarefa por aqui.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visiveis.map((t) => (
            <ItemTarefa key={t.id} tarefa={t} onAlternar={alternar} onRemover={remover} />
          ))}
        </ul>
      )}
    </main>
  );
}
