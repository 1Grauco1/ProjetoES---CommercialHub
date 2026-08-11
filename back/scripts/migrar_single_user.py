"""Migra o banco para o modelo de usuário único (sem Proprietario/Inquilino).

- salas.id_proprietario -> salas.id_usuario
- contratos.id_inquilino/id_proprietario -> contratos.id_usuario
- usuarios.nivel_acesso removido
- tabelas proprietarios e inquilinos removidas
"""

import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "CHdatabase.db"


def main() -> None:
    if not DB_PATH.exists():
        print(f"Banco não encontrado: {DB_PATH}")
        return

    backup = DB_PATH.with_name(
        f"CHdatabase.db.bak-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    )
    shutil.copy2(DB_PATH, backup)
    print(f"Backup criado: {backup}")

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("PRAGMA foreign_keys=OFF")

    try:
        _migrar_usuarios(cur)
        _migrar_salas(cur)
        _migrar_contratos(cur)
        _remover_tabelas(cur)
        con.commit()
        print("Migração concluída.")
    except Exception:
        con.rollback()
        raise
    finally:
        cur.execute("PRAGMA foreign_keys=ON")
        con.close()


def _migrar_usuarios(cur: sqlite3.Cursor) -> None:
    colunas = [row[1] for row in cur.execute("PRAGMA table_info(usuarios)")]
    if "nivel_acesso" not in colunas:
        print("usuarios.nivel_acesso já removido.")
        return

    cur.execute(
        """
        CREATE TABLE usuarios_nova (
            id INTEGER NOT NULL,
            id_pessoa INTEGER NOT NULL,
            usuario VARCHAR(50) NOT NULL,
            senha VARCHAR(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE (id_pessoa),
            UNIQUE (usuario)
        )
        """
    )
    cur.execute(
        "INSERT INTO usuarios_nova (id, id_pessoa, usuario, senha) "
        "SELECT id, id_pessoa, usuario, senha FROM usuarios"
    )
    cur.execute("DROP TABLE usuarios")
    cur.execute("ALTER TABLE usuarios_nova RENAME TO usuarios")
    print("usuarios.nivel_acesso removido.")


def _migrar_salas(cur: sqlite3.Cursor) -> None:
    colunas = [row[1] for row in cur.execute("PRAGMA table_info(salas)")]
    if "id_usuario" in colunas and "id_proprietario" not in colunas:
        print("salas já migrada.")
        return

    cur.execute("ALTER TABLE salas ADD COLUMN id_usuario INTEGER")
    cur.execute(
        """
        UPDATE salas
        SET id_usuario = (
            SELECT u.id
            FROM usuarios u
            JOIN proprietarios p ON p.id_pessoa = u.id_pessoa
            WHERE p.id = salas.id_proprietario
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE salas_nova (
            id INTEGER NOT NULL,
            id_usuario INTEGER NOT NULL,
            id_endereco INTEGER NOT NULL,
            titulo VARCHAR(150) NOT NULL,
            tamanho FLOAT NOT NULL,
            preco FLOAT NOT NULL,
            status_ocupacao VARCHAR(10) NOT NULL,
            descricao TEXT NOT NULL,
            tipo VARCHAR(11) NOT NULL,
            quartos INTEGER NOT NULL DEFAULT 0,
            banheiros INTEGER NOT NULL DEFAULT 0,
            vagas_garagem INTEGER NOT NULL DEFAULT 0,
            ar_condicionado BOOLEAN NOT NULL DEFAULT 0,
            elevador BOOLEAN NOT NULL DEFAULT 0,
            portaria BOOLEAN NOT NULL DEFAULT 0,
            mobiliada BOOLEAN NOT NULL DEFAULT 0,
            internet BOOLEAN NOT NULL DEFAULT 0,
            alarme BOOLEAN NOT NULL DEFAULT 0,
            estacionamento BOOLEAN NOT NULL DEFAULT 0,
            PRIMARY KEY (id),
            FOREIGN KEY(id_usuario) REFERENCES usuarios (id),
            FOREIGN KEY(id_endereco) REFERENCES enderecos (id)
        )
        """
    )
    cur.execute(
        """
        INSERT INTO salas_nova (
            id, id_usuario, id_endereco, titulo, tamanho, preco,
            status_ocupacao, descricao, tipo, quartos, banheiros,
            vagas_garagem, ar_condicionado, elevador, portaria, mobiliada,
            internet, alarme, estacionamento
        )
        SELECT
            id, id_usuario, id_endereco, titulo, tamanho, preco,
            status_ocupacao, descricao, tipo, quartos, banheiros,
            vagas_garagem, ar_condicionado, elevador, portaria, mobiliada,
            internet, alarme, estacionamento
        FROM salas
        """
    )
    cur.execute("DROP TABLE salas")
    cur.execute("ALTER TABLE salas_nova RENAME TO salas")
    print("salas.id_proprietario -> salas.id_usuario.")


def _migrar_contratos(cur: sqlite3.Cursor) -> None:
    colunas = [row[1] for row in cur.execute("PRAGMA table_info(contratos)")]
    if "id_usuario" in colunas:
        print("contratos já migrada.")
        return

    cur.execute("ALTER TABLE contratos ADD COLUMN id_usuario INTEGER")
    cur.execute(
        """
        UPDATE contratos
        SET id_usuario = (
            SELECT u.id
            FROM usuarios u
            JOIN inquilinos i ON i.id_pessoa = u.id_pessoa
            WHERE i.id = contratos.id_inquilino
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE contratos_nova (
            id INTEGER NOT NULL,
            id_sala INTEGER NOT NULL,
            id_usuario INTEGER NOT NULL,
            data_inicio DATE NOT NULL,
            data_termino DATE NOT NULL,
            valor FLOAT NOT NULL,
            status VARCHAR(9) NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY(id_sala) REFERENCES salas (id),
            FOREIGN KEY(id_usuario) REFERENCES usuarios (id)
        )
        """
    )
    cur.execute(
        """
        INSERT INTO contratos_nova (
            id, id_sala, id_usuario, data_inicio, data_termino, valor, status
        )
        SELECT id, id_sala, id_usuario, data_inicio, data_termino, valor, status
        FROM contratos
        """
    )
    cur.execute("DROP TABLE contratos")
    cur.execute("ALTER TABLE contratos_nova RENAME TO contratos")
    print("contratos.id_inquilino/id_proprietario -> contratos.id_usuario.")


def _remover_tabelas(cur: sqlite3.Cursor) -> None:
    for tabela in ["proprietarios", "inquilinos"]:
        existe = cur.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            (tabela,),
        ).fetchone()
        if existe:
            cur.execute(f"DROP TABLE {tabela}")
            print(f"tabela {tabela} removida.")


if __name__ == "__main__":
    main()
