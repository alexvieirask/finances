from services.config import *
from services.db_utils import *

@app.route("/")
@cache.cached()
def index():
    return render_template("pages/login.html")

@app.route("/home")
@cache.cached()
def home():
    return render_template("pages/home.html")

