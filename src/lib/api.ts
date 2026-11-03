export type Tarefa = {
  id: number;
  titulo: string;
  descricao: string | null;
  concluida: boolean;
  criadaEm: string;
};

export type NovaTarefa = {
  titulo: string;
  descricao?: string | null;
};

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

async function chamar<T>(caminho: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${BASE_URL}/api/tarefas${caminho}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const corpo = await resposta.json();
      mensagem = corpo?.erro ?? corpo?.title ?? mensagem;
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(mensagem);
  }
  return resposta.status === 204 ? (undefined as T) : resposta.json();
}

export const api = {
  listar: () => chamar<Tarefa[]>(""),
  criar: (dados: NovaTarefa) => chamar<Tarefa>("", { method: "POST", body: JSON.stringify(dados) }),
  atualizar: (tarefa: Tarefa) =>
    chamar<Tarefa>(`/${tarefa.id}`, {
      method: "PUT",
      body: JSON.stringify({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        concluida: tarefa.concluida,
      }),
    }),
  remover: (id: number) => chamar<void>(`/${id}`, { method: "DELETE" }),
};
