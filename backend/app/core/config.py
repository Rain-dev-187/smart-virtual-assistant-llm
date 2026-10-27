from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://sva:sva_password@db:5432/sva_db"
    secret_key: str = "ganti-di-env"
    llm_api_key: str = ""
    llm_base_url: str = ""
    llm_model: str = ""
    api_key: str = ""  # kosong = auth mati (mode dev)

    class Config:
        env_file = ".env"


settings = Settings()
