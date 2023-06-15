''' Importação das configurações e serviços '''
from services.config import *

class DB_Account():
    def get_record_by_name(name:str,id:int):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_select_by_name = '''SELECT * FROM "public"."Account" WHERE name = %s AND user_id = %s'''
            
            cur.execute(Q_select_by_name,(name,id,))
            
            record = cur.fetchone()

            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            SYS_Postgres.log_transaction("get_record_by_name")
       
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_record_by_name",error)
        finally:
            connection.close()
    
    def insert_record(name,amount,opening_balance,user_id):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_insert_account = '''
            INSERT INTO "Account" (name, amount, opening_balance, user_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            '''

            values = (name,amount,opening_balance,user_id)
            cur.execute(Q_insert_account, values)
            connection.commit()

            cur.close()
            SYS_Postgres.log_transaction("insert_record")
    
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("insert_record",error)
         
        finally:
            connection.close()


    def get_account_with_max_amount(user_id:int):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_max_current_amount = '''SELECT acc.amount, acc.name AS account_name FROM public."Account" AS acc
                                    WHERE amount = (SELECT MAX(amount) FROM public."Account")
                                    AND user_id = {}
                                    '''.format(user_id)
            
            cur.execute(Q_max_current_amount)
            record = cur.fetchone()
            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            SYS_Postgres.log_transaction("get_account_with_max_amount")
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_account_with_max_amount",error)
    
        finally:
            connection.close()