''' Importações extras '''
from datetime import datetime, timedelta
import os
import random
import platform
import pytz


''' Importações Flask SQLALCHEMY '''
from flask import Flask, render_template,jsonify, request, redirect, url_for, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_bcrypt import Bcrypt,generate_password_hash,check_password_hash
from flask_mail import Mail, Message
from sqlalchemy.exc import IntegrityError

from _secrets import *

''' Configuração do timezone utilizado '''
BR_TZ = pytz.timezone('America/Sao_Paulo')

''' Configuração do nome do arquivo da database  '''
DATABASE_FILENAME = 'database.db'

''' Configurações Flask SQLALCHEMY '''
app = Flask(__name__, template_folder='../src', static_folder='../src/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DATABASE_FILENAME
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

db = SQLAlchemy(app)

''' Liberação das Foreing Keys '''
with app.app_context():
    db.session.execute(text('PRAGMA FOREIGN_KEYS=ON'))

''' Importações JWT '''
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

''' Configurações JWT '''
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=3)
jwt = JWTManager(app)
cors = CORS(app)
bcrypt = Bcrypt(app) 

''' Importações Esquemas '''
from schemas.user                 import User
from schemas.account              import Account
from schemas.transaction          import Transaction
from schemas.category             import Category
from schemas.token_reset_password import TokenResetPassword

''' Criação do banco de dados '''
with app.app_context():
    if not os.path.exists(DATABASE_FILENAME):
        db.create_all()