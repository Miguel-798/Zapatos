from sqlalchemy import create_engine, NullPool
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# Base URL
db_url = settings.database_url

# Conexión síncrona (psycopg2)
sync_url = db_url.replace('postgresql://', 'postgresql+psycopg2://')
engine = create_engine(sync_url, poolclass=NullPool)

# Conexión asíncrona (asyncpg) - necesita postgresql+asyncpg://
async_url = db_url.replace('postgresql://', 'postgresql+asyncpg://')
async_engine = create_async_engine(
    async_url,
    poolclass=NullPool,
    connect_args={
        "statement_cache_size": 0,
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
