import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException

UPLOADS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

TIPOS_PERMITIDOS = [
    "image/jpeg",
    "image/png",
    "image/webp"
]

TAMANHO_MAXIMO = 5 * 1024 * 1024  # 5 MB


async def salvar_imagem(foto: UploadFile) -> str:
    # Verifica o tipo da imagem
    if foto.content_type not in TIPOS_PERMITIDOS:
        raise HTTPException(
            status_code=400,
            detail="Formato de imagem inválido."
        )

    # Lê o conteúdo do arquivo
    conteudo = await foto.read()

    # Verifica o tamanho
    if len(conteudo) > TAMANHO_MAXIMO:
        raise HTTPException(
            status_code=400,
            detail="A imagem deve ter no máximo 5 MB."
        )

    # Garante que a pasta exista
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    
    if not foto.filename:
        raise HTTPException(
            status_code=400, detail="Arquivo inexistente."
        )

    extensao = os.path.splitext(foto.filename)[1].lower()

    nome_arquivo = f"{uuid.uuid4()}{extensao}"

    
    caminho = UPLOADS_DIR / nome_arquivo

    with open(caminho, "wb") as arquivo:
        arquivo.write(conteudo)


    return f"uploads/{nome_arquivo}"
