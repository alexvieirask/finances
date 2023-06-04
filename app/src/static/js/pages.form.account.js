import *  as __global from "./__utils.global.js"

const { Session, RedirectTo, MathConversions, Form } = __global

document.querySelector(".icon-return-page").addEventListener("click",RedirectTo.Account)

document.querySelector("#form-new-account").addEventListener("submit",handleNewAccount)

document.querySelector("#account-initial-value").addEventListener("input",Form.inputTypeNumber)


async function handleNewAccount(event){
    event.preventDefault();
    let accountName = document.getElementById("account-name").value 
    let accountInitialValue = document.getElementById("account-initial-value").value 
    
    var button = document.querySelector("#add-new-account")
    button.disabled = true
    let url = `http://${Session.IP_ADDRESS}:5000/form/new_account`
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${Session.JWT}`
        },
        body:  JSON.stringify({
            account_name        :       accountName,
            opening_balance     :       MathConversions.convertMoneyFloatToInteger(accountInitialValue),
        })
    });

    const responseData = await response.json()

    var HTML_FORM_CONTAINER = document.querySelector(".items-input")
    var HTML_SPAN = document.createElement("span")

    if (responseData.status != 200){
        Form.removeErrorMessage()
        HTML_SPAN.classList.add("form-span-error")
        HTML_SPAN.textContent = responseData.details
        HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
    }
    else{
        Form.removeErrorMessage()
        HTML_SPAN.classList.add("form-span-success")
        HTML_SPAN.textContent = responseData.details
        HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
        
        document.querySelector("#form-new-account").reset()
        
    }
    button.disabled = false

}
