class Formulario:
    class FaltouPreencherCamposObrigatorios(Exception):
        def __init__(self):
            self.message = "Faltou preencher campos obrigatórios."

        def __str__(self):
            return self.message
        
    class EmailInvalido(Exception):
        def __init__(self):
            self.message = "E-mail não é valido."

        def __str__(self):
            return self.message
         


class Usuario:
    class EmailNaoEncontrado(Exception):
        def __init__(self):
            self.message = "E-mail não registrado no sistema."

        def __str__(self):
            return self.message
        
    class DadosIncorretos(Exception):
        def __init__(self):
            self.message = "E-mail ou senha incorreto."

        def __str__(self):
            return self.message


    class EmailJaCadastradoNoSistema(Exception):
        def __init__(self):
            self.message = "E-mail já registrado no sistema."

        def __str__(self):
            return self.message
        
    class UsuarioJaCadastradoNoSistema(Exception):
        def __init__(self):
            self.message = "Usuário já registrado no sistema."

        def __str__(self):
            return self.message

    class SenhasNaoCoincidem(Exception):
        def __init__(self):
            self.message = "As senhas não coincidem."

        def __str__(self):
            return self.message
        
    class Token:

        class NaoEncontrado(Exception):
            def __init__(self):
                self.message = "O token informado não foi encontrado."

            def __str__(self):
                return self.message
        
        class JaFoiUtilizado(Exception):
            def __init__(self):
                self.message = "O token já foi utilizado, por favor faça a geração de outro token."

            def __str__(self):
                return self.message
            
        class Expirado(Exception):
            def __init__(self):
                self.message = "O token informado expirou."

            def __str__(self):
                return self.message
        
class Conta:
    class NomeJaUtilizado(Exception):
            def __init__(self):
                self.message = "Já existe uma conta registrada com esse nome."

            def __str__(self):
                return self.message

class Categoria:
    class NomeJaUtilizado(Exception):
            def __init__(self):
                self.message = "Já existe uma categoria registrada com esse nome."

            def __str__(self):
                return self.message