from services.config import *

@app.route("/user/info")
@jwt_required() 
def user_info_route(): 
    try:
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail) 

        response = jsonify({"status":200, "details": user })

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    
    return response

@app.route("/user/info/all_accounts")
@jwt_required() 
def user_info_all_accounts_route(): 
    try:
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail) 
        limit = int(request.args.get('limit')) or 0

        accounts = DB_User.get_accounts_by_user_id(user["id"], limit)

        response = jsonify({"status":200, "details": accounts })

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    
    return response