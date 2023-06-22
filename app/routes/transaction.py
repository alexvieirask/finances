from services.config import *
from services.forms_utils import *

@app.route("/transaction/simple", methods=['POST'] )
@jwt_required() 
def transaction_simple(): 
    try:
        useremail = get_jwt_identity()
        fields = request.get_json()
        
        if fields_empty(fields):
            raise Formulario.FaltouPreencherCamposObrigatorios
        
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail) 
   
    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
        return response