''' Importação das configurações e serviços '''
from services.config import *

class DB_TokenRP():
    def get_record_by_token(token:str):
        try:
            connection = connect_database()
            cur = connection.cursor()
            
            Q_select_by_token = '''SELECT * FROM "public"."tokenresetpassword" WHERE ID = %s '''
            
            cur.execute(Q_select_by_token,(token,))
            
            record = cur.fetchone()

            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            SYS_Postgres.log_transaction("get_record_by_token")
       
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_record_by_token",error)
        finally:
            connection.close()

    def insert_record(user_id:int, token:str):
        try:
            connection = connect_database()
            cur = connection.cursor()
          
            Q_insert_tokenRP = '''
            INSERT INTO public."TokenResetPassword" (user_id, token)
            VALUES (%s, %s)
            RETURNING id
            '''

            values = (user_id, token)
            cur.execute(Q_insert_tokenRP, values)
            connection.commit()
            inserted_id = cur.fetchone()[0]
            
            cur.close()
            
            SYS_Postgres.log_transaction("insert_record")
            return inserted_id
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("insert_record",error)
        finally:
            connection.close()

    def update_is_valid(is_valid:bool, id:int):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_update_password = '''
            UPDATE TokenResetPassword SET is_valid = %s WHERE ID  = %s
            RETURNING id
            '''
 
            cur.execute(Q_update_password, (is_valid,id))
            connection.commit()

            inserted_id = cur.fetchone()[0]
            
            cur.close()

            SYS_Postgres.log_transaction("update_is_valid")
            return inserted_id
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("update_is_valid",error)
        finally:
            connection.close()

class SYS_TokenRP():
    def generate_token_restore_password():
        characters = string.digits

        token = ''.join(random.choice(characters) for _ in range(6))
        return token