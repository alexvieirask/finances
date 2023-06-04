''' Importação das configurações e serviços '''
from services.config import *
from services.forms_utils import *

@app.route("/signin/auth", methods=['POST'])
def signin_authenticate_route():
    try:
        fields = request.get_json()
        if not fields_empty(fields):
            email_exists = DB_User.get_record_by_email(fields["useremail"])
            if email_exists:
                if SYS_USER.validate_login(fields["useremail"],fields["userpassword"]):
                    access_token = create_access_token(identity = fields["useremail"])
                    response =  jsonify({"status":200, "details":access_token})
                else:
                    response = jsonify({"status":203, "details":"E-mail ou senha incorreto."})
            else:
                response = jsonify({"status":251, "details":"E-mail não registrado no sistema."})    
        else:
            response = jsonify({"status":250, "details":"Faltou preencher campos obrigatórios."})    
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response

@app.route("/signup/auth", methods = ["POST"])
def singup_authenticate_route():
    try:
        fields = request.get_json()

        if not fields_empty(fields):
            username_exists = DB_User.get_record_by_username(fields["username"])
            email_exists = DB_User.get_record_by_email(fields["useremail"])
            
            if not username_exists and not email_exists:
                    if email_is_valid(fields["useremail"]):
                        if fields["userpassword"] == fields["userrepeatpassword"]:
                            hash_password = generate_password_hash(fields["userpassword"]).decode("UTF-8")
                            
                            DB_User.insert_record(
                                fields["fullname"],
                                fields["username"],
                                fields["useremail"],
                                hash_password
                            )

                            response = jsonify({"status":200, "details":"Usuário registrado no sistema."})
                        else:
                            response = jsonify({"status":230, "details":"As senhas não coincidem."})
                    else:
                         response = jsonify({"status":220, "details":"E-mail não é valido."})
            else:
                response = jsonify({"status":201, "details":"Usuário ou e-mail já registrado no sistema.", "exists": {"email": str(email_exists), "username":str(username_exists)}})
        else:
            response = jsonify({"status":250, "details":"Faltou preencher campos obrigatórios."})    
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response

@app.route('/forgout_password', methods=['POST'])
def forgout_password():
    try:
        fields = request.get_json()
        if not fields_empty(fields):
            user = DB_User.get_record_by_email(fields["useremail"])
        
            if user:
                token = SYS_TokenRP.generate_token_restore_password()
                
                DB_TokenRP.insert_record(
                    user["id"],
                    token
                )

                msg = Message('Redefinir senha', sender = 'alexvieiradias2019@gmail.com', recipients = [fields["useremail"]])
                msg.html = render_template("utils/_utils.body_email.html", token=token)
                
                mail.send(msg)
                response = jsonify({"status":200, "details":"Foi encaminhado um e-mail com instruções para o e-mail informado."})
            else:
                response =  jsonify({"status":552, "details":"O e-mail informado não esta registrado no sistema."})
        else:
            response = jsonify({"status":250, "details":"Faltou preencher campos obrigatórios."})    
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response
    
@app.route("/redefine_password", methods = ['POST'])
def redefine_password():
    try:
        fields = request.get_json() 

        if not fields_empty(fields):
            Q_user = DB_User.get_record_by_email(fields["useremail"])
            Q_token = DB_TokenRP.get_record_by_token(fields["userresetpasswordtoken"])

            if Q_token:
                if Q_token.is_valid:
                    if Q_token.expires > datetime.now():
                        if fields["userresetpasswordnewpassword"] == fields["userresetpasswordrepeatnewpassword"]:
                            
                            hash_password = generate_password_hash(fields["userresetpasswordnewpassword"]).decode("UTF-8")
                            Q_user.password_hash = hash_password
                            DB_User.update_password_by_id(hash_password,Q_user.id)
                            DB_TokenRP.update_is_valid(False,Q_token.id)
                            
                            response = jsonify({"status":200, "details":"A senha foi alterada."})
                        else:
                            response = jsonify({"status":230, "details":"As senhas não coincidem."})
                    else:
                        response = jsonify({"status":370, "details":"O token expirou, por favor faça a geração de outro token."})
                else:
                    response = jsonify({"status":380, "details":"O token já foi utilizado, por favor faça a geração de outro token."})
            else:
                response = jsonify({"status":360, "details":"O token informado não foi encontrado."})
        else:
            response = jsonify({"status":250, "details":"Faltou preencher campos obrigatórios."}) 

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response