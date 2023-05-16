from services.config import *
from services.db_utils import *

def handle_expires_time():
    now_br = datetime.now(BR_TZ)
    now_br += timedelta(hours= 0.5)
    return now_br

class TokenResetPassword(db.Model):
    __tablename__ = "TokenResetPassword"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    token = db.Column(db.Text, nullable = False, unique = True)
    is_valid = db.Column(db.Boolean, nullable = False, default= True)
    expires = db.Column(db.DateTime, default= handle_expires_time())
    register_date = db.Column(db.DateTime, default= datetime.now(BR_TZ))

    ''' Relacionamentos '''
    user_email= db.Column(db.Text, db.ForeignKey("User.email"), nullable = False)

    def __init__(self, token:str, user_email:str):
        self.token = token
        self.user_email = user_email

    def create(token:str,user_email:str):
        try:
            new_token_reset_password = TokenResetPassword(
                token,
                user_email
            )
            db.session.add(new_token_reset_password)
            db.session.commit()
        finally:
            db.session.close()

    def to_dict(self):
        dict = {
            "id"                    :       self.id,
            "token"                 :       self.token,
            "is_valid"              :       self.is_valid,
            "expires"               :       self.expires,
            "register_date"         :       self.register_date

        }
        return dict

    def generateToken() -> str:
        random_token = '{:06d}'.format(random.randint(0, 999999))
        return random_token
