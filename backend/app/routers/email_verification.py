from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.orm import Session
from pydantic import EmailStr

from ..database import get_db
from ..models.user import User
from ..schemas import email
from .oauth2 import create_access_token, verify_access_token
from ..config import settings


router = APIRouter(
    prefix='/account_verification',
    tags=['email verification']
)

# Port 465: SSL
#      587: TLS
conf = ConnectionConfig(
    MAIL_USERNAME   = settings.email,        # type: ignore
    MAIL_PASSWORD   = settings.password,     # type: ignore
    MAIL_FROM       = settings.email,        # type: ignore
    MAIL_PORT       = 587,
    MAIL_SERVER     = "smtp.gmail.com",
    MAIL_STARTTLS   = True,
    MAIL_SSL_TLS    = False,
    USE_CREDENTIALS = True,
)

async def _send_verification_email(
    background_tasks: BackgroundTasks,
    recipient_list: EmailStr,
    user: User,
):
    token = create_access_token({"user_id": user.id})

    html = f"""
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; text-align: center;">
        <h3>Learn2nihon Account Verification</h3>
        <p>Hi <strong>{user.username}</strong>,</p>
        <p>Thanks for signing up! Please verify your email by clicking below:</p>
        <a
          href="http://localhost:8000/account_verification/?token={token}"
          style="display: inline-block; margin: 1em; padding: 1em 2em;
                 background-color: #0275d8; color: white; text-decoration: none;
                 border-radius: 0.5em;">
          Verify your email
        </a>
        <p>If you didn't register, just ignore this.</p>
      </body>
    </html>
    """

    message = MessageSchema(
        subject    = "🔒 Verify your Learn2nihon account",
        recipients = [recipient_list],
        body       = html,
        subtype    = "html", # type: ignore
    )
    fm = FastMail(conf)
    # schedule the send
    background_tasks.add_task(fm.send_message, message)


@router.post("/send-verification/", status_code=status.HTTP_202_ACCEPTED)
async def send_verification(
    data: email.EmailSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await _send_verification_email(background_tasks, data.email, user)
    return {"msg": "Verification email has been sent"}


@router.get("/", response_class=HTMLResponse)
async def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    try:
        token_data = verify_access_token(
            token=token,
            credentials_exception=HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        )
    except HTTPException as e:
        raise e

    user = db.query(User).filter(User.id == token_data.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified: # type: ignore
        return HTMLResponse("<h3>Your email is already verified!</h3>")

    # mark verified
    user.is_verified = True # type: ignore
    db.commit()

    return HTMLResponse("<h3>🎉 Email successfully verified! You can now log in.</h3>")
