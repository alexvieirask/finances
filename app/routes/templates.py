''' Importação das configurações e serviços '''
from services.config import *

@app.route("/")
def pages_login():
    return render_template("pages/Login/login.html")

@app.route("/home")
def pages_home():
    return render_template("pages/home.html")

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



''' Templates Contas Financeiras '''
@app.route("/account")
def pages_account():
    return render_template("pages/Account/account.html")

@app.route("/account/details")
def pages_account_details():
    return render_template("pages/Account/account_details.html")

@app.route("/new_account")
def pages_form_account():
    return render_template("pages/Account/account_form.html")


''' Templates Cadastros Gerais '''
@app.route("/general_register")
def pages_general_register():
    return render_template("pages/General_Register/general_register.html")


@app.route("/general_register/category")
def pages_general_register_category():
    return render_template("pages/General_Register/category_form.html")

@app.route("/general_register/people")
def pages_general_register_people():
    return render_template("pages/General_Register/people_form.html")

