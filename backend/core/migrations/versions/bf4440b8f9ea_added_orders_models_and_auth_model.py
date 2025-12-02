"""Added orders models and auth model

Revision ID: bf4440b8f9ea
Revises: 5298e9d4d330
Create Date: 2025-10-31 14:01:34.501106

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'bf4440b8f9ea'
down_revision: Union[str, Sequence[str], None] = '5298e9d4d330'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('Orders',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('customer_name', sa.VARCHAR(length=256), nullable=False),
    sa.Column('phone_number', sa.VARCHAR(length=32), nullable=False),
    sa.Column('is_delivery', mysql.TINYINT(display_width=1), nullable=False),
    sa.Column('city', sa.VARCHAR(length=256), nullable=True),
    sa.Column('address', mysql.TEXT(), nullable=True),
    sa.Column('total_amount', sa.DECIMAL(precision=12, scale=2), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('admin_users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('username', sa.VARCHAR(length=80), nullable=False),
    sa.Column('password_hash', sa.VARCHAR(length=255), nullable=False),
    sa.Column('email', sa.VARCHAR(length=255), nullable=True),
    sa.Column('full_name', sa.VARCHAR(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_admin_users_username'), 'admin_users', ['username'], unique=True)
    op.create_table('ordered_products',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('product_name', sa.VARCHAR(length=256), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('price_at_time_of_order', sa.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['order_id'], ['Orders.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('ordered_products')
    op.drop_index(op.f('ix_admin_users_username'), table_name='admin_users')
    op.drop_table('admin_users')
    op.drop_table('Orders')