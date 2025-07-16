from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash(password: str):
    return pwd_context.hash(password)

# Compare Plain_password and Hashed_password
# if Plain_password after hash == Hash_password return true
def verify(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)