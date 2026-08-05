export type StatusSala =
| "Disponível"
| "Reservada"
| "Alugada"
| "Manutenção";

export type TipoSala = "Comercial" | "Residencial";

export type Endereco = {
rua: string;
numero: string;
bairro: string;
cidade: string;
estado: string;
cep: string;
};

export type Sala = {
id: number;
id_proprietario: number;
id_endereco: number;
titulo: string;
tamanho: number;
preco: number;
status_ocupacao: StatusSala;

/*

* A API pode retornar uma URL ou várias URLs.
* O frontend aceita os dois formatos.
  */
  fotos?: string | string[] | null;

descricao: string;
tipo: TipoSala;
endereco?: Endereco | null;
};

export async function criarSala(
payload: CriarSalaPayload,
images?: File[]
) {
const sala = (await responseData(
await fetch("/api/salas", {
method: "POST",
headers: authHeaders(true),
body: JSON.stringify(payload),
}),
"Não foi possível cadastrar a sala."
)) as Sala;

/*

* Se existem imagens selecionadas,
* envia cada uma individualmente.
  */
  if (images && images.length > 0) {
  console.log(
  "[SALAS API] Quantidade de imagens recebidas:",
  images.length
  );

console.log(



  "[SALAS API] Imagens:",
  images.map((image) => image.name)
);

await enviarFotos(sala.id, sala, images);


} else {
console.log("[SALAS API] Nenhuma imagem foi selecionada.");
}

return sala;
}

/*

* Envia UMA imagem por requisição.
*
* Endpoint utilizado pelo backend:
*
* POST /api/salas/{id}/foto
*
* Campo utilizado:
*
* foto
  */
  async function enviarFoto(
  id: number,
  sala: Sala,
  image: File,
  index: number,
  total: number
  ) {
  const formData = new FormData();

/*

* IMPORTANTE:
* O backend recebe uma imagem por vez
* através do campo "foto".
  */
  formData.append("foto", image);

/*

* Mantém os dados da sala junto do upload.
  */
  formData.append(
  "dados_sala",
  JSON.stringify(sala)
  );

console.log(
`[SALAS API] Enviando foto ${index + 1}/${total}:`,
image.name
);

const resposta = await responseData(
await fetch(`/api/salas/${id}/foto`, {
method: "POST",
headers: authHeaders(false),
body: formData,
}),
`Sala salva, mas não foi possível enviar a foto ${index + 1}.`
);

console.log(
`[SALAS API] Foto ${index + 1}/${total} enviada com sucesso:`,
image.name
);

return resposta;
}

/*

* Envia todas as imagens UMA POR UMA.
*
* Exemplo:
*
* images = [foto1, foto2, foto3]
*
* O frontend fará:
*
* POST /salas/3/foto → foto1
* POST /salas/3/foto → foto2
* POST /salas/3/foto → foto3
*
* Cada requisição é aguardada antes da próxima.
  */
  async function enviarFotos(
  id: number,
  sala: Sala,
  images: File[]
  ) {
  console.log(
  `[SALAS API] Iniciando envio de ${images.length} foto(s).`
  );

for (let index = 0; index < images.length; index++) {
const image = images[index];


await enviarFoto(
  id,
  sala,
  image,
  index,
  images.length
);


}

console.log(
`[SALAS API] Finalizado. ${images.length} foto(s) enviada(s).`
);
}

export type CriarSalaPayload = {
  dados_sala: Pick<
    Sala,
    | "titulo"
    | "tamanho"
    | "preco"
    | "status_ocupacao"
    | "fotos"
    | "descricao"
    | "tipo"
  > & {
    id_proprietario: number;
    id_endereco: number;
  };

  dados_endereco: Endereco;
};

export type AtualizarSalaPayload = {
dados_sala?: Partial<CriarSalaPayload["dados_sala"]>;
dados_endereco?: Partial<Endereco>;
};

function authHeaders(json = true) {
const token =
typeof window !== "undefined"
? localStorage.getItem("token")
: null;

return {
...(json
? {
"Content-Type": "application/json",
}
: {}),


...(token
  ? {
      Authorization: `Bearer ${token}`,
    }
  : {}),


};
}

async function responseData(
response: Response,
fallback: string
) {
const data = await response.json().catch(() => ({}));

if (!response.ok) {
let errorMessage = data.message;


if (!errorMessage && data.detail) {
  if (typeof data.detail === "string") {
    errorMessage = data.detail;
  } else if (
    Array.isArray(data.detail) &&
    data.detail.length > 0
  ) {
    const firstError = data.detail[0];

    errorMessage =
      firstError?.msg ||
      firstError?.message ||
      fallback;
  }
}

throw new Error(errorMessage ?? fallback);


}

return data;
}

export async function atualizarSala(
id: number,
payload: AtualizarSalaPayload,
images?: File[]
) {
const sala = (await responseData(
await fetch(`/api/salas/${id}`, {
method: "PATCH",
headers: authHeaders(true),
body: JSON.stringify(payload),
}),
"Não foi possível atualizar a sala."
)) as Sala;

/*

* Se novas imagens forem selecionadas,
* envia cada uma individualmente.
  */
  if (images && images.length > 0) {
  console.log(
  "[SALAS API] Atualização com",
  images.length,
  "nova(s) imagem(ns)."
  );


await enviarFotos(id, sala, images);


}

return sala;
}

export async function deletarSala(id: number) {
await responseData(
await fetch(`/api/salas/${id}`, {
method: "DELETE",
headers: authHeaders(false),
}),
"Não foi possível deletar a sala."
);
}
