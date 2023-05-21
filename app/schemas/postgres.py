from services.config import *

class DB_Postgres():
    def create_tables():
        try:
            connection = connect_database()
            cur = connection.cursor()

            Q_create_tables = [
                '''
                CREATE TABLE IF NOT EXISTS Account (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(50),
                    type VARCHAR(50),
                    register_date TIMESTAMP DEFAULT (current_timestamp)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS Category (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    register_date TIMESTAMP DEFAULT (current_timestamp)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS TokenResetPassword (
                    id SERIAL PRIMARY KEY,
                    token TEXT NOT NULL UNIQUE,
                    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
                    expiration_date TIMESTAMP DEFAULT (current_timestamp + interval '30 minutes'),
                    register_date TIMESTAMP DEFAULT (current_timestamp)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS Transaction (
                    id SERIAL PRIMARY KEY,
                    amount INTEGER NOT NULL,
                    type INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    register_date TIMESTAMP DEFAULT (current_timestamp),
                    account_id INTEGER,
                    FOREIGN KEY (account_id) REFERENCES Account (id)
                )
                ''',
                '''
                CREATE TABLE IF NOT EXISTS "User" (
                    id SERIAL PRIMARY KEY,
                    fullname TEXT NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    register_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
                )
                ''',
                ''' 
                ALTER TABLE IF EXISTS Account ADD COLUMN IF NOT EXISTS user_id INTEGER NOT NULL REFERENCES "User" (id)
                ''',
                '''
                ALTER TABLE IF EXISTS TokenResetPassword ADD COLUMN IF NOT EXISTS user_id INTEGER NOT NULL REFERENCES "User" (id)
                '''
                ]


            for command in Q_create_tables:
                cur.execute(command)
    
            connection.commit()
            cur.close()

            return '''status:200'''
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
            return records
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
            return record
        finally:
            connection.close()

class SYS_Postgres:
    def record_to_dict(record,cur):
        column_names = [desc[0] for desc in cur.description]
        record_to_dict = {}
    
        for column, value in zip(column_names, record):
            record_to_dict[column] = value

        return record_to_dict