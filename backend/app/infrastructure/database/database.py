from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# Disable prepared statements for pgbouncer (transaction mode)
# statement_cache_size=0 fixes "prepared statement does not exist" error
async_connection_args = {
    "statement_cache_size": 0,
}

# Conexión síncrona (para uso general)
engine = create_engine(settings.database_url.replace('postgresql://', 'postgresql+psycopg2://'))

# Conexión asíncrona
async_engine = create_async_engine(
    settings.database_url.replace('postgresql://', 'postgresql+asyncpg://'),
    connect_args=async_connection_args,
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
