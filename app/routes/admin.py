''' Importação das configurações e serviços '''
from services.config import *
from services.db_utils import *

''' To do: Adicionar o JWTREQUIRED EM todas as rotas.  '''

@app.route("/<string:class_type>/return_all")
def return_all_route(class_type):
    try:
        class_type = class_type.title()
        class_list = [ User,Account,Category,TokenResetPassword,Transaction ]

        for type in class_list:
            if type.__tablename__ == class_type:
                datas = db_query_all(type)
                json_datas = [ data.to_dict() for data in datas ]
                response = jsonify({"result":"ok", "details":json_datas})
                return response
            response = jsonify({"result":"error", "details":"Bad Request"})

    except Exception as error:
        response = jsonify({"result":"error", "details":str(error)})

    return response

@app.route("/<string:class_type>/<int:id>")
def return_data_route(class_type , id):
    try:
        class_type = class_type.title()
        class_list = [ User,Account,Category,TokenResetPassword,Transaction ]

        for type in class_list:
            if type.__tablename__ == class_type:
                data = db_query_by_id(type,id)
                response = jsonify({"result":"ok", "details":data.to_dict()})
                return response
            response = jsonify({"result":"error", "details":"Bad Request"})

    except Exception as error:
        response = jsonify({"result":"error", "details":str(error)})

    return response

@app.route("/<string:class_type>/include", methods = ["POST"])
def include_route(class_type):
    try:
        class_type = class_type.title()
        class_list = [ User,Account,Category,TokenResetPassword,Transaction ]
        datas = request.get_to_dict()

        for type in class_list:
            if type.__tablename__ == class_type:
                new_data = type(**datas)

                db.session.add(new_data)
                db.session.commit()

                response = jsonify({"result":"ok", "details": new_data.to_dict()})
                return response
        response = jsonify({"result":"error", "details":"Bad Request"})

    except Exception as error:
        response = jsonify({"result":"error", "details":str(error)})
    
    finally:
        db.session.close()

    return response

''' Rota: [ delete_route ]
    descrição: Esta rota é responsável por deletar um item de uma determinada tabela da database.

    Testes:
        1. curl localhost:5000/user/delete/1 "Authorization: Bearer [TOKEN]"
        2. curl localhost:5000/game/delete/1 "Authorization: Bearer [TOKEN]"
        3. curl localhost:5000/giftcard/delete/1 "Authorization: Bearer [TOKEN]"
        4. curl localhost:5000/medal/delete/1 "Authorization: Bearer [TOKEN]"
        5. curl localhost:5000/screenshot/delete/1 "Authorization: Bearer [TOKEN]"
        6. curl localhost:5000/purchase/delete/1 "Authorization: Bearer [TOKEN]"

    Obs.: Esta rota necessita do JWT no corpo da requisição.
'''
@app.route("/<string:class_type>/delete/<int:id>")
def delete_route(class_type:str, id:int):
    try:
        class_type = class_type.title()
        class_list = [ User,Account,Category,TokenResetPassword,Transaction ]

        for type in class_list:
            if type.__tablename__ == class_type:
                data = db_query_by_id(type,id)
                
                if data:
                    db.session.delete(data)
                    db.session.commit()
                    response = jsonify({"result":"success", "details":"{} successfully deleted".format(type.__tablename__)})
                else:
                    response = jsonify({"result":"error", "details":"{} not found".format(type.__tablename__)})

                return response

            response = jsonify({"result":"error", "details":"Bad Request"})

    except Exception as error:
        response = jsonify({"result":"error", "details":str(error)})

    finally:
        db.session.close()
    return response