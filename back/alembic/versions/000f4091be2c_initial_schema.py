"""Initial schema: tabelas base do projeto (enderecos, pessoas, usuarios, salas, contratos, fotos)."""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "000f4091be2c"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "enderecos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("rua", sa.String(length=150), nullable=False),
        sa.Column("numero", sa.String(length=20), nullable=False),
        sa.Column("bairro", sa.String(length=100), nullable=False),
        sa.Column("cidade", sa.String(length=100), nullable=False),
        sa.Column("estado", sa.String(length=2), nullable=False),
        sa.Column("cep", sa.String(length=9), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "pessoas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("telefone", sa.String(length=20), nullable=True),
        sa.Column("id_endereco", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["id_endereco"], ["enderecos.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_table(
        "usuarios",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("id_pessoa", sa.Integer(), nullable=False),
        sa.Column("usuario", sa.String(length=50), nullable=False),
        sa.Column("senha", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(["id_pessoa"], ["pessoas.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("id_pessoa"),
        sa.UniqueConstraint("usuario"),
    )
    op.create_table(
        "salas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("id_usuario", sa.Integer(), nullable=False),
        sa.Column("id_endereco", sa.Integer(), nullable=False),
        sa.Column("titulo", sa.String(length=150), nullable=False),
        sa.Column("tamanho", sa.Float(), nullable=False),
        sa.Column("preco", sa.Float(), nullable=False),
        sa.Column(
            "status_ocupacao",
            sa.Enum("DISPONIVEL", "RESERVADA", "ALUGADA", "MANUTENCAO", name="statussala"),
            nullable=False,
        ),
        sa.Column("descricao", sa.Text(), nullable=False),
        sa.Column("tipo", sa.Enum("COMERCIAL", "RESIDENCIAL", name="tiposala"), nullable=False),
        sa.ForeignKeyConstraint(["id_endereco"], ["enderecos.id"]),
        sa.ForeignKeyConstraint(["id_usuario"], ["usuarios.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "contratos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("id_sala", sa.Integer(), nullable=False),
        sa.Column("id_usuario", sa.Integer(), nullable=False),
        sa.Column("data_inicio", sa.Date(), nullable=False),
        sa.Column("data_termino", sa.Date(), nullable=False),
        sa.Column("valor", sa.Float(), nullable=False),
        sa.Column(
            "status",
            sa.Enum("ATIVO", "ENCERRADO", "CANCELADO", "PENDENTE", name="statuscontrato"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["id_sala"], ["salas.id"]),
        sa.ForeignKeyConstraint(["id_usuario"], ["usuarios.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "fotos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("id_sala", sa.Integer(), nullable=False),
        sa.Column("caminho", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["id_sala"], ["salas.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("fotos")
    op.drop_table("contratos")
    op.drop_table("salas")
    op.drop_table("usuarios")
    op.drop_table("pessoas")
    op.drop_table("enderecos")
