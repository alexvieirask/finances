import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.general_register.js"

const { RedirectTo, Form, MessageInput } = __global

RedirectTo.ButtonRedirectOnClick(".icon-return-page",RedirectTo.GeneralRegister)

Form.onSubmit("#form-category",handleNewCategory)
async function handleNewCategory(event){
    try{
        Form.handleRequest(event,"#form-category", async function(){
            let category_name = document.getElementById("category-name").value
            const responseData = await api.insert_new_category(category_name)
            
            if (responseData.status != 200){
                MessageInput.show(responseData.details, 1,'.items-input')
            }
            else{
                MessageInput.show(responseData.details, 2,'.items-input')
                $("#form-new-account").reset()
            }
        })
    }catch(error){
        console.log(error)
    }
}