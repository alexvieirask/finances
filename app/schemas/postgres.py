''' Importação das configurações e serviços '''
from services.config import *

class DB_Postgres():
    def create_tables():
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_create_tables = [
                '''
                CREATE TABLE IF NOT EXISTS "User" (
                    id SERIAL PRIMARY KEY,
                    fullname TEXT NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    register_date TIMESTAMP DEFAULT (current_timestamp)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "Account" (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    opening_balance INTEGER NOT NULL,
                    amount INTEGER NOT NULL,
                    register_date TIMESTAMP DEFAULT (current_timestamp),

                    user_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES "User" (id)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "Category" (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    register_date TIMESTAMP DEFAULT (current_timestamp)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "TokenResetPassword" (
                    id SERIAL PRIMARY KEY,
                    token TEXT NOT NULL UNIQUE,
                    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
                    expiration_date TIMESTAMP DEFAULT (current_timestamp + interval '30 minutes'),
                    register_date TIMESTAMP DEFAULT (current_timestamp),
                    
                    user_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES "User" (id)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "TransactionSimple" (
                    id SERIAL PRIMARY KEY,
                    amount INTEGER NOT NULL,
                    type INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    register_date TIMESTAMP DEFAULT (current_timestamp),
                    
                    account_id INTEGER NOT NULL,
                    category_id INTEGER NOT NULL,

                    FOREIGN KEY (account_id) REFERENCES "Account" (id),
                    FOREIGN KEY (category_id) REFERENCES "Category" (id)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "People" (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    telephone INTEGER,
                    email TEXT UNIQUE,
                    register_date TIMESTAMP DEFAULT (current_timestamp)
                ) 
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "TransactionBase" (
                    id SERIAL PRIMARY KEY,
                    amount INTEGER NOT NULL,
                    due_date DATE,
                    periodicity TEXT
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "AccountsPayable" (
                    transaction_id INTEGER PRIMARY KEY,
                    person_id INTEGER NOT NULL,
                    account_id INTEGER NOT NULL,
                    category_id INTEGER NOT NULL,
                    
                    FOREIGN KEY (transaction_id) REFERENCES "TransactionBase" (id) ON DELETE CASCADE,
                    FOREIGN KEY (person_id) REFERENCES "People" (id),
                    FOREIGN KEY (account_id) REFERENCES "Account" (id),
                    FOREIGN KEY (category_id) REFERENCES "Category" (id)
                ) INHERITS ("TransactionBase")
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "AccountsReceivable" (
                    transaction_id INTEGER PRIMARY KEY,
                    person_id INTEGER NOT NULL,
                    account_id INTEGER NOT NULL,
                    category_id INTEGER NOT NULL,
                    
                    FOREIGN KEY (transaction_id) REFERENCES "TransactionBase" (id) ON DELETE CASCADE,
                    FOREIGN KEY (person_id) REFERENCES "People" (id),
                    FOREIGN KEY (account_id) REFERENCES "Account" (id),
                    FOREIGN KEY (category_id) REFERENCES "Category" (id)
                ) INHERITS ("TransactionBase")
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "TransactionPeriodicity" (
                    id SERIAL PRIMARY KEY,
                    due_date DATE,
                    amount INTEGER NOT NULL,
                    
                    transaction_id INTEGER NOT NULL,
                    FOREIGN KEY (transaction_id) REFERENCES "TransactionBase" (id) ON DELETE CASCADE
                )
                '''
            ]

            for command in Q_create_tables:
                cur.execute(command)

            connection.commit()
            cur.close()
            
            SYS_Postgres.log_transaction("create_tables")
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("create_tables",error)
        finally:
            connection.close()
    
    def get_all_records(tablename:str):
        try:
            connection = connect_database()

            cur = connection.cursor()
            
            Q_select_all = '''SELECT * FROM "public"."{}"'''.format(tablename)
            
            cur.execute(Q_select_all)
            
            records = cur.fetchall()
       
            cur.close()

            SYS_Postgres.log_transaction("get_all_records({})".format(tablename))
            return SYS_Postgres.records_to_dict(records,cur)
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_all_records({})".format(tablename),error)
        finally:
            connection.close()

    def get_record_by_id(tablename:str, id:int):
        try:
            connection = connect_database()

            cur = connection.cursor()
            
            Q_select_by_id = '''SELECT * FROM "public"."{}" WHERE ID = %s '''.format(tablename)
            
            cur.execute(Q_select_by_id,(id,))
            
            record = cur.fetchone()
            
            cur.close()
            
            SYS_Postgres.log_transaction("get_record_by_id({})".format(tablename))
            return SYS_Postgres.record_to_dict(record,cur)
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_record_by_id({})".format(tablename), error)
        finally:
            connection.close()

    def get_record_with_max_value(tablename:str, column:str):
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_max = '''SELECT * FROM public."{}"
                                    WHERE {} = (SELECT MAX({}) FROM public."{}")
                                    '''.format(tablename,column,column,tablename)
            
            cur.execute(Q_max)
            record = cur.fetchone()
            
            if record:
                record_to_dict = SYS_Postgres.record_to_dict(record,cur)
                return record_to_dict
            
            cur.close()
            SYS_Postgres.log_transaction("get_record_with_max_value")
        
        except psycopg2.Error as error:
            SYS_Postgres.log_transaction("get_record_with_max_value",error)
    
        finally:
            connection.close()
     
''' Utils SQL  '''
class SYS_Postgres:
    def record_to_dict(record,cur):
        column_names = [desc[0] for desc in cur.description]
        record_to_dict = {}
    
        for column, value in zip(column_names, record):
            record_to_dict[column] = value

        return record_to_dict
    
    def records_to_dict(list_records:list,cur):
        list_records_to_dict = []
        column_names = [desc[0] for desc in cur.description]
        for record in list_records:
            record_to_dict = {}
            for column, value in zip(column_names, record):
                record_to_dict[column] = value
            list_records_to_dict.append(record_to_dict)

        return list_records_to_dict

    def log_transaction(transaction,details=200):
        print('''SQL: [ DATETIME: {} | Transaction: {} | status: {} ]'''.format(datetime.now(),transaction,str(details)))

    def list_error():
        LIST_ERROR = {
            "UNIQUE_CONSTRAINT" : "23505"
        }

        return LIST_ERROR
