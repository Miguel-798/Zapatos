from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Solo conexión síncrona (psycopg2)
# Evitamos asyncpg por problemas con pgbouncer de Supabase
db_url = settings.database_url.replace('postgresql://', 'postgresql+psycopg2://')

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
