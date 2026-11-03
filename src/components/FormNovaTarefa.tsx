"use client";

import { useState } from "react";
import type { NovaTarefa } from "@/lib/api";

type Props = {
  onCriar: (dados: NovaTarefa) => Promise<void>;
};

export function FormNovaTarefa({ onCriar }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!titulo.trim()) return;
    setEnviando(true);
    try {
      await onCriar({ titulo: titulo.trim(), descricao: descricao.trim() || null });
      setTitulo("");
      setDescricao("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-2 sm:flex-row">
      <input
        aria-label="Título da tarefa"
        placeholder="O que precisa ser feito?"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={120}
        className="flex-1 rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/15 dark:bg-white/5"
      />
      <input
        aria-label="Descrição (opcional)"
        placeholder="Detalhes (opcional)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        maxLength={500}
        className="flex-1 rounded-md border border-black/15 bg-white px-3 py-2 dark:border-white/15 dark:bg-white/5"
      />
      <button
        type="submit"
        disabled={enviando || !titulo.trim()}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {enviando ? "Salvando..." : "Adicionar"}
      </button>
    </form>
  );
}
