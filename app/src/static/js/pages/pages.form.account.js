import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.accounts.js"

const { RedirectTo, Form } = __global

RedirectTo.ButtonRedirectOnClick(".icon-return-page",RedirectTo.Account)
document.querySelector("#form-new-account").addEventListener("submit",handleNewAccount)
document.querySelector("#account-initial-value").addEventListener("input",Form.inputTypeNumber)

async function handleNewAccount(event){
    try{
        event.preventDefault();
        var button = document.querySelector("#add-new-account")
        button.disabled = true
        
        let account_name_value = document.getElementById("account-name").value
        let opening_balance = document.getElementById("account-initial-value").value 
    
        const responseData = await api.insert_new_account(account_name_value, opening_balance)
        
        Form.removeErrorMessage()
        if (responseData.status != 200){
           Form.showErrorMessage(responseData.details,'.items-input')
        }
        else{
            Form.showSuccessMessage(responseData.details,'.items-input')
            $("#form-new-account").reset()
        }
        button.disabled = false
    }
    catch(error){
        console.log(error)
    }
}