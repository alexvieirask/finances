''' Importação das configurações e serviços '''
from services.config import *
from services.forms_utils import *

@app.route("/signin/auth", methods=['POST'])
def signin_authenticate_route():
    try:
        fields = request.get_json()

        if fields_empty(fields):
            raise Formulario.FaltouPreencherCamposObrigatorios

        email_exists = DB_User.get_record_by_email(fields["useremail"])
        
        if not email_exists:
            raise Usuario.EmailNaoEncontrado
            
        if not SYS_USER.validate_login(fields["useremail"],fields["userpassword"]):
            raise Usuario.DadosIncorretos
        
        access_token = create_access_token(identity = fields["useremail"])
        response =  jsonify({"status":200, "details":access_token})
        
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    
    finally:
        return response
    
@app.route("/signup/auth", methods = ["POST"])
def singup_authenticate_route():
    try:
        fields = request.get_json()

        if fields_empty(fields):
            raise Formulario.FaltouPreencherCamposObrigatorios
        
        username_exists = DB_User.get_record_by_username(fields["username"])
        email_exists = DB_User.get_record_by_email(fields["useremail"])
        
        if username_exists:
            raise Usuario.UsuarioJaCadastradoNoSistema

        if email_exists:
            raise Usuario.EmailJaCadastradoNoSistema

        if not email_is_valid(fields["useremail"]):
            raise Formulario.EmailInvalido

        if fields["userpassword"] != fields["userrepeatpassword"]:
            raise Usuario.SenhasNaoCoincidem
    
        hash_password = generate_password_hash(fields["userpassword"]).decode("UTF-8")
        
        DB_User.insert_record(
            fields["fullname"],
            fields["username"],
            fields["useremail"],
            hash_password
        )

        response = jsonify({"status":200, "details":"Usuário registrado no sistema."})
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response

@app.route('/forgout_password', methods=['POST'])
def forgout_password():
    try:
        fields = request.get_json()
        
        if fields_empty(fields):
            raise Formulario.FaltouPreencherCamposObrigatorios
    
        user = DB_User.get_record_by_email(fields["useremail"])
        
        if not user:
            raise Usuario.EmailNaoEncontrado
        token = SYS_TokenRP.generate_token_restore_password()
            
        DB_TokenRP.insert_record(
            user["id"],
            token
        )

        msg = Message('Redefinir senha', sender = 'alexvieiradias2019@gmail.com', recipients = [fields["useremail"]])
        msg.html = render_template("utils/_utils.body_email.html", token=token)
        mail.send(msg)
        
        response = jsonify({"status":200, "details":"Foi encaminhado um e-mail com instruções para o e-mail informado."})
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response
    
@app.route("/redefine_password", methods = ['POST'])
def redefine_password():
    try:
        fields = request.get_json()
        
        if fields_empty(fields):
            raise Formulario.FaltouPreencherCamposObrigatorios

        user = DB_User.get_record_by_email(fields["useremail"])
        token = DB_TokenRP.get_record_by_token(fields["userresetpasswordtoken"])

        if not token:
            raise Usuario.Token.NaoEncontrado

        if not token.is_valid:
            raise Usuario.Token.JaFoiUtilizado

        if token.expires < datetime.now():
            raise Usuario.Token.Expirado
        
        if fields["userresetpasswordnewpassword"] != fields["userresetpasswordrepeatnewpassword"]:
            raise Usuario.SenhasNaoCoincidem
       
        hash_password = generate_password_hash(fields["userresetpasswordnewpassword"]).decode("UTF-8")
        user.password_hash = hash_password
        DB_User.update_password_by_id(hash_password,user.id)
        DB_TokenRP.update_is_valid(False,token.id)
        
        response = jsonify({"status":200, "details":"A senha foi alterada."})
    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response