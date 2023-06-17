from services.config import *

@app.route("/transaction/simple", methods=['POST'] )
@jwt_required() 
def transaction_simple(): 
    try:
        useremail = get_jwt_identity()
        fields = request.get_json()
        
        print(fields)
   
    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
        return response