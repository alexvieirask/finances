import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.accounts.js"

const { RedirectTo, Form, MessageInput } = __global

RedirectTo.ButtonRedirectOnClick(".icon-return-page",RedirectTo.Account)
document.querySelector("#account-initial-value").addEventListener("input",Form.inputTypeNumber)

Form.onSubmit("#form-new-account",handleNewAccount)
async function handleNewAccount(event){
    try{
        Form.handleRequest(event,"#form-new-account", async function(){
            let account_name_value = document.getElementById("account-name").value
            let opening_balance = document.getElementById("account-initial-value").value 
            const responseData = await api.insert_new_account(account_name_value, opening_balance)
        
            if (responseData.status != 200){
                MessageInput.show(responseData.details, 1,'.items-input')
            }
            else{
                MessageInput.show(responseData.details, 2,'.items-input')
                Form.onReset("#form-new-account")
            }
        })

        
        
    }
    catch(error){
        console.log(error)
    }
}