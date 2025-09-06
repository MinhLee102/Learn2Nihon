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
                sa.Column('word', sa.String(), index=True, nullable=False),
                sa.Column('description', sa.String(), nullable=True),
                sa.Column('meaning', sa.String(), nullable=False),
                sa.Column('pronunciation', sa.String(), nullable=True),
                sa.Column('lesson', sa.Integer(), nullable=False),
                sa.Column('level', sa.String(), nullable=True),
                sa.Column('example', sa.String(), nullable=True)
    )
    op.create_index('ix_vocabularies_word', 'vocabularies', ['word'])


    op.create_table('readings',
                sa.Column('id', sa.Integer(), primary_key=True, index=True),
                sa.Column('title', sa.String(), index=True, nullable=False),
                sa.Column('content', sa.Text(), nullable=False),
    )
    op.create_table('questions',
                sa.Column('id', sa.Integer(), primary_key=True, index=True),
                sa.Column('question_text', sa.String(), nullable=False),
                sa.Column('explanation', sa.String()),
                sa.Column('reading_id', sa.Integer(), 
                          sa.ForeignKey('readings.id', ondelete='CASCADE'), nullable=False)
    )
    op.create_table('answers',
                sa.Column('id', sa.Integer(), primary_key=True, index=True),
                sa.Column('answer_text', sa.String(), nullable=False),
                sa.Column('is_correct', sa.Boolean(), server_default=sa.text('false')),
                sa.Column('question_id', sa.Integer(), 
                          sa.ForeignKey('questions.id', ondelete='CASCADE'), nullable=False)
    )
    op.create_index('ix_readings_title', 'readings', ['title'])


    op.create_table('mazii_vocabularies',
                sa.Column('id', sa.Integer(), primary_key=True),
                sa.Column('word', sa.String(), index=True, nullable=False),
                sa.Column('phonetic', sa.String()),
                sa.Column('han_viet', sa.String()),
                sa.Column('pronunciation', sa.String()),
                sa.Column('type_word', sa.String())
    )
    op.create_table('meaning_detail',
                sa.Column('id', sa.Integer(), primary_key=True, index=True),
                sa.Column('meaning', sa.String()),
                sa.Column('vocabulary_id', sa.Integer(),
                          sa.ForeignKey('mazii_vocabularies.id', ondelete='CASCADE'), nullable=False)
    )
    op.create_table('examples',
                sa.Column('id', sa.Integer(), primary_key=True, index=True),
                sa.Column('jp', sa.String(), nullable=False),
                sa.Column('vi', sa.String(), nullable=False),
                sa.Column('meaning_detail_id', sa.Integer(),
                          sa.ForeignKey('meaning_detail.id', ondelete='CASCADE'), nullable=False)
    )
    op.create_index('ix_mazii_vocabularies_word', 'mazii_vocabularies', ['word'])
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('users')
    op.drop_table('reading_items')
    op.drop_index('ix_vocabularies_word', table_name='vocabularies')
    op.drop_table('vocabularies')

    op.drop_index('ix_readings_title', table_name='readings')
    op.drop_table('readings')
    op.drop_table('questions')
    op.drop_table('answers')

    op.drop_index('ix_mazii_vocabularies_word', table_name='mazii_vocabularies')
    op.drop_table('mazii_vocabularies')
    op.drop_table('meaning_detail')
    op.drop_table('examples')
    pass
