from services.config import *
from services.db_utils import * 
  
@app.route("/user/info")
@jwt_required()
@cache.cached(timeout=3600)
def user_info_route(): 
    try:
        useremail = get_jwt_identity()
        user = db_query_by_email(User,useremail) 
        response = jsonify({"result":"ok", "details": user.to_dict()})

    except Exception as error:
        response = jsonify({"result":"error", "details":str(error)})
    
    return response