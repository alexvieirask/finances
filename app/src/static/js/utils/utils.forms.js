
class Form {
    static async handleRequest(event, formID, processRequest) {
        try {
            await this.#BeforePost(event,formID);
            await processRequest();
            await this.#AfterPost(event,formID);
        } 
        catch (error) {
          console.log(error);
        }
    }

    static onSubmit(formID,processRequest){
        document.querySelector(formID).addEventListener("submit",processRequest)
    }

    static onReset(formID){
        var form = document.querySelector(formID)
        form.reset()
    }

    static async #BeforePost(event,formID){
        event.preventDefault()
        this.#disableButtonForm(formID)
    }
    static async #AfterPost(event,formID){
        event.preventDefault()
        this.#enableButtonForm(formID)
    }

    static inputTypeNumber(){
        var valor = this.value
        valor = valor.replace(/[^0-9.]/g, '')
        valor = valor.replace(/(\..*?)\./g, '$1')
        this.value = valor
    }

    static #disableButtonForm(formID){
        var form = document.querySelector(formID)
        var submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true
    } 
    static #enableButtonForm(formID){
        var form = document.querySelector(formID)
        var submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = false
    }
}

class MessageInput{
    static show(text,status,positionReference){
        try{
            var errorMessage = document.querySelector(".form-span-error")
            var successMessage = document.querySelector(".form-span-success")

            if (errorMessage || successMessage){
                MessageInput.update(text,status)
            }else{
                var messageSpan = document.createElement('span');

                if      (status              === 1){
                    messageSpan.classList.add('form-span-error');
                }
                else if (status         === 2){
                    messageSpan.classList.add('form-span-success');
                }
                var posReference = document.querySelector(positionReference);

                messageSpan.textContent = text;
                posReference.appendChild(messageSpan);
            }
        }
        catch(error){
            console.log(error)
        }
    }

    static update(value, status){
        try{    
            var errorMessage = document.querySelector(".form-span-error")
            var successMessage = document.querySelector(".form-span-success")
            
            if (errorMessage && status == 2){
                errorMessage.classList.remove(...errorMessage.classList)
                errorMessage.classList.add('form-span-success')
                errorMessage.textContent = value
            } else{
                successMessage.classList.remove(...successMessage.classList)
                successMessage.classList.add('.form-span-erro')
                successMessage.textContent = value
            }

        
        } 
        catch(error){
            console.log(error)
        }
    }
}

export { Form, MessageInput }