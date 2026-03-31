from sqlalchemy import create_engine, NullPool
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# Determinar URL para sincrono y asincrono
db_url = settings.database_url

# Conexión síncrona
engine = create_engine(
    db_url.replace('postgresql+asyncpg://', 'postgresql://').replace('postgresql://', 'postgresql+psycopg2://'),
    poolclass=NullPool  # Sin pool para evitar problemas con pgbouncer
)

# Conexión asíncrona con NullPool
async_engine = create_async_engine(
    db_url,
    poolclass=NullPool,  # Sin pool
    connect_args={
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,  # Para asyncpg
    }
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
