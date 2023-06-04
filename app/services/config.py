''' Importações extras '''
from datetime import datetime, timedelta
import string, platform, random, os

''' Importações postgres '''
import psycopg2

''' Importações Flask  '''
from flask import Flask, render_template,jsonify, request, redirect, url_for, abort,send_file, make_response,send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt,generate_password_hash,check_password_hash
from flask_caching import Cache, CachedResponse
from flask_mail import Mail, Message

''' Importações .env '''
from services.env import *

''' Configurações Flask'''
app = Flask(__name__, template_folder='../src', static_folder='../src/static')

''' Configurações Servidor de E-mail '''
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

''' Configurações de Cache '''
app.config['CACHE_TYPE'] = 'simple'  
app.config['CACHE_DEFAULT_TIMEOUT'] = 3600 
cache = Cache(app)
user_caches = {}

''' Importações JWT '''
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

''' Configurações JWT '''
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=3)
jwt = JWTManager(app)
cors = CORS(app)
bcrypt = Bcrypt(app) 

''' Importações Schemas '''
from schemas.postgres import DB_Postgres, SYS_Postgres
from schemas.user import DB_User, SYS_USER
from schemas.tokenrp import DB_TokenRP, SYS_TokenRP
from schemas.account import DB_Account


''' Inicialização banco de dados '''
with app.app_context():
    DB_Postgres.initialize_database_connection()