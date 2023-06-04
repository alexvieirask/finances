import *  as __global from "./__utils.global.js"

const { Session, RedirectTo, MathConversions, Form } = __global

document.querySelector(".icon-return-page").addEventListener("click",RedirectTo.Account)
document.querySelector("#form-new-account").addEventListener("submit",handleNewAccount)
document.querySelector("#account-initial-value").addEventListener("input",Form.inputTypeNumber)

async function handleNewAccount(event){
    try{
        event.preventDefault();
        var button = document.querySelector("#add-new-account")
       
        button.disabled = true
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/form/new_account`
        
        let response = await fetch(URL_REQUEST, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${Session.JWT}`
            },
            body:  JSON.stringify({
                account_name        :       document.getElementById("account-name").value,
                opening_balance     :       MathConversions.convertMoneyFloatToInteger(document.getElementById("account-initial-value").value).toString()
            })
        });
    
        const responseData = await response.json()
    
        var HTML_FORM_CONTAINER = document.querySelector(".items-input")
        var HTML_SPAN = document.createElement("span")
        
        Form.removeErrorMessage()
        if (responseData.status != 200){
            HTML_SPAN.classList.add("form-span-error")
            HTML_SPAN.textContent = responseData.details
            HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
        }
        else{
            HTML_SPAN.classList.add("form-span-success")
            HTML_SPAN.textContent = responseData.details
            HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
            document.querySelector("#form-new-account").reset()
        }
        button.disabled = false
    }
    catch(error){
        console.log(error)
    }
}
