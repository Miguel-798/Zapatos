"""add stock and indexes to shoes

Revision ID: add_stock_and_indexes
Revises: e9f3f88485ab
Create Date: 2026-04-01 14:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_stock_and_indexes'
down_revision: Union[str, Sequence[str], None] = 'e9f3f88485ab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add stock column and indexes to shoes table."""
    # Add indexes first (from previous migration)
    op.create_index('ix_shoes_category_id', 'shoes', ['category_id'], unique=False)
    op.create_index('ix_shoes_brand_id', 'shoes', ['brand_id'], unique=False)
    op.create_index('ix_shoes_gender_id', 'shoes', ['gender_id'], unique=False)
    op.create_index('ix_shoes_supplier_id', 'shoes', ['supplier_id'], unique=False)
    op.create_index('ix_shoes_location_id', 'shoes', ['location_id'], unique=False)
    op.create_index('ix_shoes_season_id', 'shoes', ['season_id'], unique=False)
    
    op.create_index('ix_shoe_colors_shoe_id', 'shoe_colors', ['shoe_id'], unique=False)
    op.create_index('ix_shoe_colors_color_id', 'shoe_colors', ['color_id'], unique=False)
    op.create_index('ix_shoe_materials_shoe_id', 'shoe_materials', ['shoe_id'], unique=False)
    op.create_index('ix_shoe_materials_material_id', 'shoe_materials', ['material_id'], unique=False)
    op.create_index('ix_shoe_sizes_shoe_id', 'shoe_sizes', ['shoe_id'], unique=False)
    op.create_index('ix_shoe_sizes_size_id', 'shoe_sizes', ['size_id'], unique=False)
    op.create_index('ix_shoe_sizes_shoe_stock', 'shoe_sizes', ['shoe_id', 'stock_quantity'], unique=False)
    
    # Add stock column (nullable first)
    op.add_column('shoes', sa.Column('stock', sa.Integer(), nullable=True))
    
    # Calculate stock from shoe_sizes table
    op.execute("""
        UPDATE shoes SET stock = (
            SELECT COALESCE(SUM(stock_quantity), 0) 
            FROM shoe_sizes 
            WHERE shoe_sizes.shoe_id = shoes.id
        )
    """)
    
    # Set default for any remaining nulls
    op.execute("UPDATE shoes SET stock = 0 WHERE stock IS NULL")
    
    # Alter to NOT NULL
    op.alter_column('shoes', 'stock', nullable=False)


def downgrade() -> None:
    """Remove stock column and indexes."""
    op.alter_column('shoes', 'stock', nullable=True)
    op.drop_column('shoes', 'stock')
    
    op.drop_index('ix_shoe_sizes_shoe_stock', table_name='shoe_sizes')
    op.drop_index('ix_shoe_sizes_size_id', table_name='shoe_sizes')
    op.drop_index('ix_shoe_sizes_shoe_id', table_name='shoe_sizes')
    op.drop_index('ix_shoe_materials_material_id', table_name='shoe_materials')
    op.drop_index('ix_shoe_materials_shoe_id', table_name='shoe_materials')
    op.drop_index('ix_shoe_colors_color_id', table_name='shoe_colors')
    op.drop_index('ix_shoe_colors_shoe_id', table_name='shoe_colors')
    op.drop_index('ix_shoes_season_id', table_name='shoes')
    op.drop_index('ix_shoes_location_id', table_name='shoes')
    op.drop_index('ix_shoes_supplier_id', table_name='shoes')
    op.drop_index('ix_shoes_gender_id', table_name='shoes')
    op.drop_index('ix_shoes_brand_id', table_name='shoes')
    op.drop_index('ix_shoes_category_id', table_name='shoes')