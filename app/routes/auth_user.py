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
                    response = jsonify({"status":203, "details":"Incorrect email or password."})
            else:
                response = jsonify({"status":251, "details":"Email not registered in the system."})    
        else:
            response = jsonify({"status":250, "details":"Required fields empty."})    
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

                            response = jsonify({"status":200, "details":"User registered successfully."})
                        else:
                            response = jsonify({"status":230, "details":"Password does not match."})
                    else:
                         response = jsonify({"status":220, "details":"E-mail is not valid."})
            else:
                response = jsonify({"status":201, "details":"Username or E-mail already registered in the system.", "exists": {"email": str(email_exists), "username":str(username_exists)}})
        else:
            response = jsonify({"status":250, "details":"Required fields empty."})    
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
                response = jsonify({"status":200, "details":"Password reset email has been sent to your email address."})
            else:
                response =  jsonify({"status":552, "details":"There is no email address registered in the system."})
        else:
            response = jsonify({"status":250, "details":"Required fields empty."})    
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
                            
                            response = jsonify({"status":200, "details":"User password changed successfully."})
                        else:
                            response = jsonify({"status":230, "details":"Password does not match."})
                    else:
                        response = jsonify({"status":370, "details":"Token is expires, please generate other Token."})
                else:
                    response = jsonify({"status":380, "details":"Token is used, please generate other Token."})
            else:
                response = jsonify({"status":360, "details":"Token not found."})
        else:
            response = jsonify({"status":250, "details":"Required fields empty."}) 

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response