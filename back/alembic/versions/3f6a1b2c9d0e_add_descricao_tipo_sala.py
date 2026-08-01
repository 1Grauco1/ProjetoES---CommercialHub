"""adiciona descricao e tipo na sala

Revision ID: 3f6a1b2c9d0e
Revises: 2ec7fbbb8fb8
Create Date: 2026-07-31 12:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '3f6a1b2c9d0e'
down_revision: Union[str, Sequence[str], None] = '2ec7fbbb8fb8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("salas") as batch_op:
        batch_op.add_column(
            sa.Column('descricao', sa.Text(), nullable=False, server_default='')
        )
        batch_op.add_column(
            sa.Column(
                'tipo',
                sa.Enum('COMERCIAL', 'RESIDENCIAL', name='tiposala'),
                nullable=False,
                server_default='COMERCIAL',
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("salas") as batch_op:
        batch_op.drop_column('descricao')
        batch_op.drop_column('tipo')
