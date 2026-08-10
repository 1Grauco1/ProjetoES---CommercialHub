"use client";

import { useEffect, useState } from "react";

export default function DebugSalaPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/salas/3")
      .then(async (response) => {
        const json = await response.json();

        if (!response.ok) {
          throw new Error(
            json?.message || `Erro HTTP ${response.status}`
          );
        }

        return json;
      })
      .then((json) => {
        console.log("SALA:", json);
        console.log("FOTOS:", json.fotos);

        setData(json);
      })
      .catch((err) => {
        console.error("ERRO:", err);
        setError(err.message || "Erro desconhecido");
      });
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Erro
          </h1>

          <p className="mt-4 text-slate-700">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100">
        <p>Consultando sala...</p>
      </main>
    );
  }

  const fotos = Array.isArray(data.fotos) ? data.fotos : [];

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">
          Diagnóstico da Sala #{data.id}
        </h1>

        <p className="mt-2 text-slate-500">
          {data.titulo}
        </p>

        <div className="mt-8 rounded-xl bg-slate-100 p-5">
          <p className="text-sm text-slate-500">
            Quantidade de fotos
          </p>

          <p className="mt-1 text-3xl font-bold text-[#D35400]">
            {fotos.length}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold">
            URLs recebidas
          </h2>

          <pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-5 text-sm text-white">
            {JSON.stringify(fotos, null, 2)}
          </pre>
        </div>

        {fotos.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold">
              Imagens
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fotos.map((foto: string, index: number) => (
                <div
                  key={`${foto}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-3">
                    <p className="text-sm font-semibold">
                      Foto {index + 1}
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-500">
                      {foto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <details className="mt-8">
          <summary className="cursor-pointer font-semibold">
            Ver resposta completa da API
          </summary>

          <pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-5 text-xs text-white">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}

