
class Form {
    static removeErrorMessage(){
        var spanErrorExists = document.querySelector(".form-span-error")
        var spanSuccessExists = document.querySelector(".form-span-success")
        if (spanErrorExists) spanErrorExists.remove()
        if (spanSuccessExists) spanSuccessExists.remove()
    }

    static inputTypeNumber(){
        var valor = this.value;

        valor = valor.replace(/[^0-9.]/g, '');
    
        valor = valor.replace(/(\..*?)\./g, '$1');
    
    
        this.value = valor;
    }
}


export { Form }