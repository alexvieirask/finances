
class Form {
    static removeErrorMessage(){
        try{
            var spanErrorExists = document.querySelector(".form-span-error")
            var spanSuccessExists = document.querySelector(".form-span-success")  
            if (spanErrorExists) spanErrorExists.remove()
            if (spanSuccessExists) spanSuccessExists.remove()
        } 
        catch(error){
            console.log(error)
        }
    }

    static inputTypeNumber(){
        try{
            var valor = this.value
            valor = valor.replace(/[^0-9.]/g, '')
            valor = valor.replace(/(\..*?)\./g, '$1')
            this.value = valor
        }
        catch(error){
            console.log(error)
        }  
    }
}

export { Form }