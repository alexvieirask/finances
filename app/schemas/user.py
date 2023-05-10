from services.config import *

class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.Text(50), unique=True, nullable=False)
    email = db.Column(db.Text(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    register_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    ''' Relacionamentos '''
    accounts = db.relationship("Account", backref = "User")
    
    def __init__(self, username, email, password_hash):
        self.username = username
        self.email = email
        self.password_hash = password_hash

    def to_dict(self):
        dict = {
            'id'                :       self.id,
            'username'          :       self.username,
            'email'             :       self.email,
            'password_hash'     :       self.password_hash,
            'register_date'     :       self.register_date,
            'accounts'          :       self.accounts
        }
        return dict