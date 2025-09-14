from pydantic_settings import BaseSettings
from pydantic import EmailStr

class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    database_url: str

    algorithm: str
    access_secret_key: str
    access_token_expire_minutes: int
    refresh_secret_key: str
    refresh_token_expire_hours: int

    email: EmailStr
    password: str

    class Config:
        env_file = ".env"

settings = Settings() # type: ignore
