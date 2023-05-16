from services.config import *
from services.db_utils import *

class User(db.Model):
    __tablename__ = 'User' 
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fullname = db.Column(db.Text(80), nullable=False)
    username = db.Column(db.Text(50), unique=True, nullable=False)
    email = db.Column(db.Text(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    register_date = db.Column(db.DateTime, nullable=False, default=datetime.now(BR_TZ))

    ''' Relacionamentos '''
    accounts = db.relationship("Account", backref = "User", lazy = False)
    tokens = db.relationship("TokenResetPassword", backref = "User", lazy = False)
    
    def __init__(self, fullname, username, email, password_hash):
        self.fullname = fullname
        self.username = username
        self.email = email
        self.password_hash = password_hash

    def create(fullname:str, username:str, email:str, password_hash:str):
        try:
            new_user = User(
                fullname, 
                username, 
                email,
                password_hash
            )
            db.session.add(new_user)
            db.session.commit()
        
        except Exception as error:
            return str(error)
        
        finally:
            db.session.close()

    def to_dict(self):
        dict = {
            'id'                :       self.id,
            'fullname'          :       self.fullname,
            'username'          :       self.username,
            'email'             :       self.email,
            'password_hash'     :       self.password_hash,
            'register_date'     :       self.register_date,
            'accounts'          :       self.accounts
        }
        return dict
    
    def list_tokens_in_dict(self):
        list_tokens_in_dict = []

        for token in self.tokens:
            list_tokens_in_dict.append(token.to_dict())
        return list_tokens_in_dict
    
    def validate_login(email:str,password:str) -> bool:
        user = db_query_by_email(User, email)
        if user:
            password = check_password_hash(user.password_hash,password)
            if password:
                return True
        return False
    