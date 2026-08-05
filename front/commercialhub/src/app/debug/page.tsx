"use client";

import { useEffect, useState } from "react";

type SalaDebug = {
id?: number;
titulo?: string;
fotos?: string | string[] | null;
[key: string]: unknown;
};

export default function DebugSalaPage() {
const [data, setData] = useState<SalaDebug | null>(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
async function carregarSala() {
try {
setLoading(true);
setError("");


    const response = await fetch("/api/salas/3", {
      cache: "no-store",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(
        json?.message || `Erro HTTP ${response.status}`
      );
    }

    console.log("========== DEBUG SALA ==========");
    console.log("SALA COMPLETA:", json);
    console.log("FOTOS RECEBIDAS:", json.fotos);
    console.log(
      "É ARRAY?:",
      Array.isArray(json.fotos)
    );
    console.log(
      "TIPO DE FOTOS:",
      typeof json.fotos
    );

    if (Array.isArray(json.fotos)) {
      console.log(
        "QUANTIDADE DE FOTOS:",
        json.fotos.length
      );

      json.fotos.forEach(
        (foto: unknown, index: number) => {
          console.log(
            `FOTO ${index + 1}:`,
            foto
          );
        }
      );
    } else {
      console.log(
        "A API NÃO RETORNOU UM ARRAY."
      );
    }

    console.log(
      "JSON COMPLETO:",
      JSON.stringify(json, null, 2)
    );

    console.log("================================");

    setData(json);
  } catch (err) {
    console.error("ERRO AO BUSCAR SALA:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Erro desconhecido."
    );
  } finally {
    setLoading(false);
  }
}

carregarSala();


}, []);

if (loading) {
return ( <main className="grid min-h-screen place-items-center bg-slate-100"> <div className="rounded-2xl bg-white p-8 shadow"> <p className="text-slate-600">
Consultando sala... </p> </div> </main>
);
}

if (error) {
return ( <main className="min-h-screen bg-slate-100 p-10"> <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow"> <h1 className="text-2xl font-bold text-red-600">
Erro ao consultar a sala </h1>

```
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          {error}
        </p>
      </div>
    </div>
  </main>
);


}

if (!data) {
return ( <main className="grid min-h-screen place-items-center bg-slate-100"> <p className="text-slate-600">
Nenhum dado encontrado. </p> </main>
);
}

/*

* Mantemos o valor original para diagnóstico.
  */
  const fotosRecebidas = data.fotos;

/*

* Só consideramos fotos válidas para o
* carrossel quando a API realmente retornar
* um array.
  */
  const fotos: string[] = Array.isArray(
  fotosRecebidas
  )
  ? fotosRecebidas.filter(
  (foto): foto is string =>
  typeof foto === "string" &&
  foto.length > 0
  )
  : [];

const ehArray = Array.isArray(
fotosRecebidas
);

let tipoFotos: string = typeof fotosRecebidas;

if (ehArray) {
  tipoFotos = "Array";
} else if (fotosRecebidas === null) {
  tipoFotos = "null";
}

return ( <main className="min-h-screen bg-slate-100 p-6 sm:p-10"> <div className="mx-auto max-w-6xl">
{/* Cabeçalho */} <div className="rounded-2xl bg-white p-6 shadow"> <p className="text-sm font-semibold text-[#D35400]">
DEBUG DA API </p>

```
      <h1 className="mt-1 text-3xl font-bold text-[#1b263b]">
        Sala #{data.id}
      </h1>

      <p className="mt-2 text-slate-500">
        {data.titulo || "Sem título"}
      </p>
    </div>

    {/* Diagnóstico */}
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {/* Tipo */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Tipo de `fotos`
        </p>

        <p className="mt-2 text-2xl font-bold text-[#1b263b]">
          {tipoFotos}
        </p>
      </div>

      {/* Array */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          É um array?
        </p>

        <p
          className={`mt-2 text-2xl font-bold ${
            ehArray
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {ehArray ? "SIM" : "NÃO"}
        </p>
      </div>

      {/* Quantidade */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Quantidade de fotos
        </p>

        <p className="mt-2 text-3xl font-bold text-[#D35400]">
          {fotos.length}
        </p>
      </div>
    </div>

    {/* Diagnóstico principal */}
    <div className="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-[#1b263b]">
        Diagnóstico do campo `fotos`
      </h2>

      <div
        className={`mt-4 rounded-xl border p-5 ${
          ehArray
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        {ehArray ? (
          <>
            <p className="font-bold text-green-700">
              ✓ A API retornou um ARRAY.
            </p>

            <p className="mt-2 text-sm text-green-700">
              Foram recebidas{" "}
              <strong>{fotos.length}</strong>{" "}
              foto(s).
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-red-700">
              ✕ A API NÃO retornou um ARRAY.
            </p>

            <p className="mt-2 text-sm text-red-700">
              O campo `fotos` está sendo recebido
              como{" "}
              <strong>{tipoFotos}</strong>.
            </p>

            <p className="mt-2 text-sm text-red-700">
              Por isso o frontend não consegue
              percorrer várias imagens.
            </p>
          </>
        )}
      </div>
    </div>

    {/* Valor bruto de fotos */}
    <div className="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-[#1b263b]">
        Valor recebido em `data.fotos`
      </h2>

      <pre className="mt-4 overflow-auto rounded-xl bg-slate-900 p-5 text-sm text-white">
        {JSON.stringify(
          fotosRecebidas,
          null,
          2
        )}
      </pre>
    </div>

    {/* Array normalizado */}
    <div className="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-[#1b263b]">
        Fotos interpretadas pelo frontend
      </h2>

      <pre className="mt-4 overflow-auto rounded-xl bg-slate-900 p-5 text-sm text-white">
        {JSON.stringify(
          fotos,
          null,
          2
        )}
      </pre>
    </div>

    {/* Lista de URLs */}
    {fotos.length > 0 && (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-[#1b263b]">
          URLs das fotos
        </h2>

        <div className="mt-5 space-y-3">
          {fotos.map(
            (foto, index) => (
              <div
                key={`${foto}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-bold text-[#1b263b]">
                  Foto {index + 1}
                </p>

                <p className="mt-2 break-all text-xs text-slate-500">
                  {foto}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    )}

    {/* Imagens */}
    {fotos.length > 0 && (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-[#1b263b]">
          Imagens recebidas
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map(
            (foto, index) => (
              <div
                key={`${foto}-${index}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <img
                  src={foto}
                  alt={`Foto ${index + 1}`}
                  className="h-56 w-full object-cover"
                  onLoad={() => {
                    console.log(
                      `IMAGEM ${index + 1} CARREGADA:`,
                      foto
                    );
                  }}
                  onError={() => {
                    console.error(
                      `ERRO AO CARREGAR IMAGEM ${index + 1}:`,
                      foto
                    );
                  }}
                />

                <div className="p-4">
                  <p className="font-semibold">
                    Foto {index + 1}
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {foto}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )}

    {/* Nenhuma foto */}
    {fotos.length === 0 && (
      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="font-bold text-yellow-800">
          Nenhuma foto disponível no array
        </h2>

        <p className="mt-2 text-sm text-yellow-700">
          A API não entregou um array contendo
          as URLs das imagens.
        </p>
      </div>
    )}

    {/* Resposta completa */}
    <details className="mt-6 rounded-2xl bg-white p-6 shadow">
      <summary className="cursor-pointer font-bold text-[#1b263b]">
        Ver resposta completa da API
      </summary>

      <pre className="mt-4 max-h-[600px] overflow-auto rounded-xl bg-slate-900 p-5 text-xs text-white">
        {JSON.stringify(
          data,
          null,
          2
        )}
      </pre>
    </details>
  </div>
</main>
);
}
