"""adiciona titulo na sala

Revision ID: 4a1b2c3d4e5f
Revises: 3f6a1b2c9d0e
Create Date: 2026-08-01 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '4a1b2c3d4e5f'
down_revision: Union[str, Sequence[str], None] = '3f6a1b2c9d0e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("salas") as batch_op:
        batch_op.add_column(
            sa.Column('titulo', sa.String(length=150), nullable=False, server_default='')
        )


def downgrade() -> None:
    with op.batch_alter_table("salas") as batch_op:
        batch_op.drop_column('titulo')
