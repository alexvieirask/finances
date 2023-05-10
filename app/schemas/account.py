from services.config import *

class Account(db.Model):
    __tablename__ = "Account"
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    name = db.Column(db.Text(50))
    type = db.Column(db.Text(50))
    register_date = db.Column(db.DateTime, default= datetime.utcnow())

    ''' Relacionamentos '''
    user_id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable = False)
    transactions = db.relationship("Transaction", backref="Account")

    def __init__(self, name, type, user_id):
        self.name = name
        self.type = type
        self.user_id = user_id

    def to_dict(self):
        dict =  {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "register_date": self.register_date,
            "user_id": self.user_id
        }

        return dict