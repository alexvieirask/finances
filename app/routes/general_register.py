from services.config import *
from services.forms_utils import *

@app.route("/general_register/form_category", methods=['POST'] )
@jwt_required() 
def general_register_category(): 
    try:
        fields = request.get_json()
    
        if fields_empty(fields):
            raise Formulario.FaltouPreencherCamposObrigatorios
        
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail) 
        category_exists = DB_GeneralRegister.category_get_record_by_name(fields["category_name"], user["id"])
        
        if category_exists:
            raise Categoria.NomeJaUtilizado

        DB_GeneralRegister.category_insert_record(
            fields["category_name"],
            user["id"]
        )
        
        response = jsonify({"status":200, "details":"Categoria registrada."})

   
    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
    return response


@app.route("/general_register/all_category", methods = ['GET'])
@jwt_required() 
def general_register_all_category(): 
    try:
        useremail = get_jwt_identity()
        user = DB_User.get_record_by_email(useremail)
        
        limit = request.args.get('limit')
        
        if limit:
            categorys = DB_GeneralRegister.get_all_categorys(user["id"], int(limit))
        else:
            categorys = DB_GeneralRegister.get_all_categorys(user["id"])
        
        response = jsonify({"status":200, "details": categorys })
      
    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
    return response