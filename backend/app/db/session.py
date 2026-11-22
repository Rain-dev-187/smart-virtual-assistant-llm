from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# Membuka sesi database untuk satu request, lalu menutupnya setelah selesai.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
