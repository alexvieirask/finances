from services.config import *

@app.route("/user/info")
@jwt_required()
@cache.cached(timeout=3600)
def user_info_route(): 
    try:
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail) 

        response = jsonify({"status":200, "details": user })

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    
    return response