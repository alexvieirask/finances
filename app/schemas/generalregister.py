''' Importação das configurações e serviços '''
from services.config import *

class DB_GeneralRegister():
    def category_insert_record(name,user_id):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_insert_category = '''
            INSERT INTO "public"."Category" (name, user_id)
            VALUES (%s, %s)
            RETURNING id
            '''

            values = (name,user_id)
            cur.execute(Q_insert_category, values,)
            connection.commit()

            cur.close()
            SYS_Postgres.log_transaction("category_insert_record")
    
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("category_insert_record",error)
         
        finally:
            connection.close()

    def get_all_categorys(user_id:int,limit=0):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_select_all = '''
            SELECT B.ID, B.NAME AS CATEGORY_NAME FROM   "public"."User"     AS A
            INNER JOIN                            "public"."Category" AS B ON B.user_id = A.id
            WHERE A.id = %s 
            '''

            if limit > 0:
                Q_select_all += ''' LIMIT {}'''.format(str(limit))

            cur.execute(Q_select_all,(user_id,))

            records = cur.fetchall()
            cur.close()
            
            SYS_Postgres.log_transaction("get_all_categorys")
            return SYS_Postgres.records_to_dict(records,cur)
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_all_categorys",error)
        finally:
            connection.close()

    def category_get_record_by_name(name:str,id:int):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_select_by_name = '''SELECT * FROM "public"."Category" WHERE name = %s AND user_id = %s'''
          
            cur.execute(Q_select_by_name,(name,id,))
            
            record = cur.fetchone()

            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            SYS_Postgres.log_transaction("category_get_record_by_name")
       
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("category_get_record_by_name",error)
        finally:
            connection.close()