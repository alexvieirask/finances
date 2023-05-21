''' Importação das configurações e serviços '''
from services.config import *

@app.route("/<string:class_type>/return_all")
def return_all_route(class_type):
    try:
        class_type = class_type.title()
    
        for type in TABLE_LIST:
            if type == class_type:
                records = DB_Postgres.get_all_records(type)
                response = jsonify({"status":200, "details":records})
                return response
            response = jsonify({"status":778, "details":"Bad Request"})

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})
    return response

@app.route("/<string:class_type>/<int:id>")
def return_data_route(class_type , id):
    try:
        class_type = class_type.title()

        for tablename in TABLE_LIST:
            if tablename == class_type:
                data = DB_Postgres.get_record_by_id(tablename,id)
                response = jsonify({"status":200, "details":data})
                return response
            response = jsonify({"status":778, "details":"Bad Request"})

    except Exception as error:
        response = jsonify({"status":777, "details":str(error)})

    return response