import re

''' Recebe um dict e verifica se todos os campos estão preenchidos '''
def fields_empty(dict:dict) -> list:
    try:
        for field in dict:
            if not dict[field]: return True
        return False

    except Exception as error:
        print(str(error))

''' Recebe uma string de e-mail e retorna se é valido ou não '''
def email_is_valid(email:str)-> bool:
    pattern = '[a-z 0-9]+[\._]?[a-z 0-9]+[@]\w+[.]\w{2,3}$'
    if re.search(pattern,email):
        return True
    return False
