"""init table

Revision ID: d517b7ef8739
Revises: 
Create Date: 2025-08-08 15:53:11.397952

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd517b7ef8739'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('users', 
                sa.Column('id', sa.Integer(), primary_key=True, index=True, nullable=False),
                sa.Column('username', sa.String(), unique=True, nullable=False),
                sa.Column('email', sa.String(), unique=True, nullable=False),
                sa.Column('full_name', sa.String()),
                sa.Column('password', sa.String(), nullable=False),
                sa.Column('is_verified', sa.Boolean(), nullable=False, server_default=sa.text('false')),
                sa.Column('created_at', sa.TIMESTAMP(timezone=True),
                             nullable=False, server_default=sa.text('now()')),
    )
    op.create_table('reading_items',
                sa.Column('id', sa.Integer(), primary_key=True, index=True),
                sa.Column('title', sa.String(), index=True),
                sa.Column('content', sa.String()),
                sa.Column('choices', sa.ARRAY(sa.String())),
                sa.Column('answer', sa.String())
    )
    op.create_table('vocabularies',
                sa.Column('id', sa.Integer(), primary_key=True, index=True), 
                sa.Column('word', sa.String(), nullable=False),
                sa.Column('description', sa.String(), nullable=True),
                sa.Column('meaning', sa.String(), nullable=False),
                sa.Column('pronunciation', sa.String(), nullable=True),
                sa.Column('lesson', sa.Integer(), nullable=False),
                sa.Column('level', sa.String(), nullable=True),
                sa.Column('example', sa.String(), nullable=True)
    )
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('users')
    op.drop_table('reading_items')
    op.drop_table('vocabularies')
    pass
