from services.config import *

@app.route("/user/info")
@jwt_required() 
def user_info_route(): 
    try:
        useremail = get_jwt_identity()
        user_cache = SYS_Postgres.get_user_cache(useremail)

        data = user_cache.get("user_info")

        if data is None:
            data = DB_User.get_record_by_email(useremail) 
            user_cache.set("user_info", data)
            
        response = jsonify({"status":200, "details": data })
        

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    
    return response

@app.route("/user/info/all_accounts")
@jwt_required() 
def user_info_all_accounts_route(): 
    try:
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail) 

        limit = request.args.get('limit')
        
        if limit:
            limit = int(limit)
            accounts = DB_User.get_accounts_by_user_id(user["id"], limit)
        else:
            accounts = DB_User.get_accounts_by_user_id(user["id"])
        response = jsonify({"status":200, "details": accounts })

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    
    return response