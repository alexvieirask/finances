''' Importação das configurações e serviços '''
from services.config import *

@app.route("/")
def pages_login():
    return render_template("pages/Login/login.html")

@app.route("/home")
def pages_home():
    return render_template("pages/home.html")

@app.route("/account")
def pages_account():
    return render_template("pages/Account/account.html")

@app.route("/account/details")
def pages_account_details():
    return render_template("pages/Account/account_details.html")

@app.route("/transactionSimple")
def pages_transaction():
    return render_template("pages/transactionSimple.html")

@app.route("/accounts_payable")
def pages_accounts_payable():
    return render_template("pages/accountspayable.html")

@app.route("/accounts_receivable")
def pages_accounts_receivable():
    return render_template("pages/accountsreceivable.html")

@app.route("/rebate")
def pages_rebate():
    return render_template("pages/rebate.html")

@app.route("/settings")
def pages_settings():
    return render_template("pages/settings.html")

@app.route("/new_account")
def pages_form_account():
    return render_template("pages/Account/account_form.html")