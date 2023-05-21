from services.config import *

@app.route("/")
def index():
    return render_template("pages/login.html")

@app.route("/home")
def home():
    return render_template("pages/home.html")