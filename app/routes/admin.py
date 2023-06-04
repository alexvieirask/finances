''' Importação das configurações e serviços '''
from services.config import *

@app.route("/<string:class_type>/return_all")
def return_all_route(class_type):
    try:
        class_type = class_type.title()
    
        for type in DB_Postgres.get_tablenames():
            if type == class_type:
                records = DB_Postgres.get_all_records(type)
                response = jsonify({"status":200, "details":records})
                return response
            response = jsonify({"status":778, "details":"Bad Request."})

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response

@app.route("/<string:class_type>/<int:id>")
def return_data_route(class_type , id):
    try:
        class_type = class_type.title()

        for type in DB_Postgres.get_tablenames():
            if type == class_type:
                record = DB_Postgres.get_record_by_id(type,id)
                if record:
                    response = jsonify({"status":200, "details":record})
                else:
                    response = jsonify({"status":800, "details":"User not registered in the system."})
                return response
            response = jsonify({"status":778, "details":"Bad Request."})

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})

    return response