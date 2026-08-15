"""Add sala characteristic columns (quartos, banheiros, vagas, comodidades)."""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "944f7e0bd7d4"
down_revision = "000f4091be2c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("salas", sa.Column("quartos", sa.Integer(), nullable=False))
    op.add_column("salas", sa.Column("banheiros", sa.Integer(), nullable=False))
    op.add_column("salas", sa.Column("vagas_garagem", sa.Integer(), nullable=False))
    op.add_column("salas", sa.Column("ar_condicionado", sa.Boolean(), nullable=False))
    op.add_column("salas", sa.Column("elevador", sa.Boolean(), nullable=False))
    op.add_column("salas", sa.Column("portaria", sa.Boolean(), nullable=False))
    op.add_column("salas", sa.Column("mobiliada", sa.Boolean(), nullable=False))
    op.add_column("salas", sa.Column("internet", sa.Boolean(), nullable=False))
    op.add_column("salas", sa.Column("alarme", sa.Boolean(), nullable=False))
    op.add_column("salas", sa.Column("estacionamento", sa.Boolean(), nullable=False))


def downgrade() -> None:
    op.drop_column("salas", "estacionamento")
    op.drop_column("salas", "alarme")
    op.drop_column("salas", "internet")
    op.drop_column("salas", "mobiliada")
    op.drop_column("salas", "portaria")
    op.drop_column("salas", "elevador")
    op.drop_column("salas", "ar_condicionado")
    op.drop_column("salas", "vagas_garagem")
    op.drop_column("salas", "banheiros")
    op.drop_column("salas", "quartos")
