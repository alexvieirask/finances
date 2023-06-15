''' Importação das configurações e serviços '''
from services.config import *

class DB_GeneralRegister():
    def category_insert_record(name,user_id):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_insert_category = '''
            INSERT INTO "public"."Category" (name, user_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            '''

            values = (name,user_id)
            cur.execute(Q_insert_category, values)
            connection.commit()

            cur.close()
            SYS_Postgres.log_transaction("category_insert_record")
    
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("category_insert_record",error)
         
        finally:
            connection.close()