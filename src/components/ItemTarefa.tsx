"use client";

import type { Tarefa } from "@/lib/api";

type Props = {
  tarefa: Tarefa;
  onAlternar: (tarefa: Tarefa) => void;
  onRemover: (id: number) => void;
};

export function ItemTarefa({ tarefa, onAlternar, onRemover }: Props) {
  return (
    <li className="flex items-start gap-3 rounded-md border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/5">
      <input
        type="checkbox"
        checked={tarefa.concluida}
        onChange={() => onAlternar(tarefa)}
        aria-label={`Marcar "${tarefa.titulo}" como ${tarefa.concluida ? "pendente" : "concluída"}`}
        className="mt-1 h-4 w-4"
      />
      <div className="min-w-0 flex-1">
        <p className={tarefa.concluida ? "text-black/40 line-through dark:text-white/40" : "font-medium"}>
          {tarefa.titulo}
        </p>
        {tarefa.descricao && <p className="text-sm text-black/60 dark:text-white/60">{tarefa.descricao}</p>}
        <p className="text-xs text-black/40 dark:text-white/40">
          Criada em {new Date(tarefa.criadaEm).toLocaleString("pt-BR")}
        </p>
      </div>
      <button
        onClick={() => onRemover(tarefa.id)}
        aria-label={`Remover "${tarefa.titulo}"`}
        className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        Remover
      </button>
    </li>
  );
}
