from services.config import *

class DB_User():
    def get_record_by_email(email:str):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_select_by_email = '''SELECT * FROM "public"."User" WHERE email = %s'''
            
            cur.execute(Q_select_by_email,(email,))
            
            record = cur.fetchone()
            
            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            return None
        finally:
            connection.close()
    
    def get_record_by_username(username:str):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_select_by_username = '''SELECT * FROM "public"."User" WHERE username = %s'''

            cur.execute(Q_select_by_username,(username,))

            record = cur.fetchone()

            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            return None
        finally:
            connection.close()

    def insert_record(fullname, username, email, password_hash):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_insert_user = '''
            INSERT INTO "User" (fullname, username, email, password_hash)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            '''

            values = (fullname, username, email, password_hash)
            cur.execute(Q_insert_user, values)
            connection.commit()

            inserted_id = cur.fetchone()[0]
            
            cur.close()
            return inserted_id
        finally:
            connection.close()

    def update_password_by_id(new_password:str,id:int):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_update_password = '''
            UPDATE User SET password = %s WHERE ID  = %s
            RETURNING id
            '''
 
            cur.execute(Q_update_password, (new_password,id))
            connection.commit()

            inserted_id = cur.fetchone()[0]
            
            cur.close()
            return inserted_id
        finally:
            connection.close()
        
class SYS_USER():
    def validate_login(email:str,password:str) -> bool:
        try:
            user = DB_User.get_record_by_email(email)

            if user:
                password = check_password_hash(user.hash_password,password)
                
                if password:
                    return True
            return False
        except Exception as exception:
            return jsonify({"status":"777", "details": str(exception)})