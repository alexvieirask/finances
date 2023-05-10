from services.config import *

''' TYPE SAIDA E ENTRADA '''
class Transaction(db.Model):
    __tablename__ = "Transaction"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    amount = db.Column(db.Integer, nullable = False)
    type = db.Column(db.Integer, nullable = False)
    name = db.Column(db.Text, nullable = False)
    register_date = db.Column(db.DateTime, default= datetime.utcnow())

    ''' Relacionamentos '''
    category_id = db.Column(db.Integer, db.ForeignKey('Category.id'), nullable = False)
    account_id = db.Column(db.Integer, db.ForeignKey('Account.id'), nullable = False)

    db.UniqueConstraint(account_id)

    def __init__(self, amount, type, name,category_id, account_id):
        self.amount = amount
        self.type = type
        self.name = name
        self.category_id = category_id
        self.account_id = account_id

    def to_dict(self):
        dict = {
            "id"               :       self.id,
            "type"             :       self.type,
            "amount"           :       self.amount,
            "name"             :       self.name,
            "register_date"    :       self.register_date,
            "category_id"      :       self.category_id,
            "account_id"       :       self.account_id
        }
        
        return dict