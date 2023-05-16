''' Importação das configurações e serviços '''
from services.config import *
from services.db_utils import *
from services.forms_utils import *

@app.route("/signin/auth", methods=['POST'])
def signin_authenticate_route():
    try:
        fields = request.get_json()
        if not fields_empty(fields):
            email_exists = db_query_by_email(User, fields["useremail"])
            if email_exists:
                if User.validate_login(fields["useremail"],fields["userpassword"]):
                    access_token = create_access_token(identity = fields["useremail"])
                    response =  jsonify({"status":"200", "details":access_token})
                else:
                    response = jsonify({"status": "203", "details":"Incorrect email or password."})
            else:
                response = jsonify({"status":"251", "details":"Email not registered in the system."})    
        else:
            response = jsonify({"status":"250", "details":"Required fields empty."})    
    except Exception as error:
        response = jsonify({"status":"777", "details":str(error)})
    finally:
        db.session.close()
    return response

@app.route("/signup/auth", methods = ["POST"])
def singup_authenticate_route():
    try:
        fields = request.get_json()
        if not fields_empty(fields):
            username_exists = db_query_by_username(User, fields["username"])
            email_exists = db_query_by_email(User, fields["useremail"])
            
            if not username_exists and not email_exists:
                    if email_is_valid(fields["useremail"]):
                        if fields["userpassword"] == fields["userrepeatpassword"]:
                            hash_password = generate_password_hash(fields["userpassword"]).decode("UTF-8")
                            
                            new_user = User (
                                fields["fullname"],
                                fields["username"],
                                fields["useremail"],
                                hash_password
                            )

                            db.session.add(new_user)
                            db.session.commit()

                            response = jsonify({"status":"200", "details":"User registered successfully."})
                        else:
                            response = jsonify({"status":"230", "details":"Password does not match."})
                    else:
                         response = jsonify({"status":"220", "details":"E-mail is not valid."})
            else:
                response = jsonify({"status":"201", "details":"Username or E-mail already registered in the system.", "exists": {"email": str(email_exists), "username":str(username_exists)}})
        else:
            response = jsonify({"status":"250", "details":"Required fields empty."})    
    except Exception as error:
        response = jsonify({"status":"777", "details":str(error)})
    finally:
        db.session.close()
    return response

@app.route('/forgout_password', methods=['POST'])
def forgout_password():
    try:
        fields = request.get_json()
        if not fields_empty(fields):
            if db_check_if_useremail_exists(User,fields["useremail"]):
                token = TokenResetPassword.generateToken()
                TokenResetPassword.create(
                    token,
                    fields["useremail"]
                )

                msg = Message('Redefinir senha', sender = 'alexvieiradias2019@gmail.com', recipients = [fields["useremail"]])
                msg.html = render_template("utils/_utils.body_email.html", token=token)
                
                mail.send(msg)
                response = jsonify({"status":"200", "details":'Um e-mail com instruções para redefinir sua senha foi enviado para o seu endereço de e-mail.'})
            else:
                response =  jsonify({"status":"552", "details":"nao possui email no sistema "})
        else:
            response = jsonify({"status":"250", "details":"Required fields empty."})    
    except Exception as error:
        response = jsonify({"status":"777", "details":str(error)})
    finally:
        db.session.close()
    return response
    
@app.route("/redefine_password", methods = ['POST'])
def redefine_password():
    try:
        fields = request.get_json() 

        if not fields_empty(fields):
            Q_user = db_query_by_email(User, fields["useremail"])
            Q_token = db_query_token_by_token(TokenResetPassword,fields["userresetpasswordtoken"])

            if Q_token:
                if Q_token.is_valid:
                    if Q_token.expires > datetime.now():
                        if fields["userresetpasswordnewpassword"] == fields["userresetpasswordrepeatnewpassword"]:
                            
                            hash_password = generate_password_hash(fields["userresetpasswordnewpassword"]).decode("UTF-8")
                            Q_user.password_hash = hash_password
                            Q_token.is_valid = False
                            
                            db.session.add(Q_user)
                            db.session.add(Q_token)

                            db.session.commit()

                            response = jsonify({"status":"200", "details":"User password changed successfully."})
                        else:
                            response = jsonify({"status":"230", "details":"Password does not match."})
                    else:
                        response = jsonify({"status":"370", "details":"Token is expires, please generate other Token."})
                else:
                    response = jsonify({"status":"380", "details":"Token is used, please generate other Token."})
            else:
                response = jsonify({"status":"360", "details":"Token not found."})
        else:
            response = jsonify({"status":"250", "details":"Required fields empty."}) 

    except Exception as error:
        response = jsonify({"status":"777", "details":str(error)})
    finally:
        db.session.close()
    return response