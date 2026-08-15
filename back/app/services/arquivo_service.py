import uuid
from pathlib import Path

import anyio
from fastapi import HTTPException, UploadFile

UPLOADS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

TIPOS_PERMITIDOS = [
    "image/jpeg",
    "image/png",
    "image/webp",
]

EXTENSAO_POR_TIPO = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

TAMANHO_MAXIMO = 5 * 1024 * 1024  # 5 MB


def detectar_tipo_imagem(conteudo: bytes) -> str | None:
    if conteudo.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if conteudo.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if len(conteudo) >= 12 and conteudo[:4] == b"RIFF" and conteudo[8:12] == b"WEBP":
        return "image/webp"
    return None


def _escrever_arquivo(caminho: Path, conteudo: bytes) -> None:
    with open(caminho, "wb") as arquivo:
        arquivo.write(conteudo)


def remover_imagem(caminho: str) -> None:
    arquivo = Path(caminho)
    if not arquivo.is_absolute():
        arquivo = UPLOADS_DIR / arquivo.name

    if arquivo.exists():
        arquivo.unlink()


async def salvar_imagem(foto: UploadFile) -> str:
    # Verifica o tipo da imagem
    if foto.content_type not in TIPOS_PERMITIDOS:
        raise HTTPException(
            status_code=400,
            detail="Formato de imagem inválido.",
        )

    # Lê o conteúdo do arquivo
    conteudo = await foto.read()

    # Verifica o tamanho
    if len(conteudo) > TAMANHO_MAXIMO:
        raise HTTPException(
            status_code=400,
            detail="A imagem deve ter no máximo 5 MB.",
        )

    # Valida o conteúdo real do arquivo (magic bytes)
    tipo_detectado = detectar_tipo_imagem(conteudo)
    if tipo_detectado is None:
        raise HTTPException(
            status_code=400,
            detail="Arquivo não é uma imagem válida (PNG, JPG ou WEBP).",
        )

    # Garante que a pasta exista
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    nome_arquivo = f"{uuid.uuid4()}{EXTENSAO_POR_TIPO[tipo_detectado]}"

    caminho = UPLOADS_DIR / nome_arquivo

    await anyio.to_thread.run_sync(_escrever_arquivo, caminho, conteudo)

    return f"uploads/{nome_arquivo}"
