from sqlalchemy import create_engine, NullPool
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# Base URL from env
db_url = settings.database_url

# Sync engine (psycopg2)
sync_url = db_url.replace('postgresql://', 'postgresql+psycopg2://')
engine = create_engine(sync_url, poolclass=NullPool)

# Async engine (asyncpg) - with pooler-safe settings
# El pooler requiere deshabilitar prepared statements
async_url = db_url.replace('postgresql://', 'postgresql+asyncpg://')
async_engine = create_async_engine(
    async_url,
    poolclass=NullPool,  # NullPool es más seguro con pgbouncer
    connect_args={
        "statement_cache_size": 0,  # Deshabilitar cache de statements
    },
    # Pool settings para pgbouncer transaction mode
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()