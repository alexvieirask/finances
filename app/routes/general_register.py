from services.config import *

@app.route("/general_register/form_category", methods=['POST'] )
@jwt_required() 
def general_register_category(): 
    try:
        useremail = get_jwt_identity()
        fields = request.get_json()
        user = DB_User.get_record_by_email(useremail)
        
        print(fields)

        DB_GeneralRegister.category_insert_record(
            fields["name"],
            user["id"]
        )


   
    except Exception as error:
        response = jsonify({"status": 777, "details": str(error)})
        return response