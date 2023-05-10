from services.config import *

class Category(db.Model):
    __tablename__ = "Category"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    name = db.Column(db.Text, nullable = False, unique = True)
    register_date = db.Column(db.DateTime, default= datetime.utcnow())

    def __init__(self, name):
        self.name = name


    def to_dict(self):
        dict = {
            "id"                :       self.id,
            "name"              :       self.name,
            "register_date"     :       self.register_date
        }
        
        return dict