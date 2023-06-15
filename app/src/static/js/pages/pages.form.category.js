import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.general_register.js"

const { RedirectTo } = __global

RedirectTo.ButtonRedirectOnClick(".icon-return-page",RedirectTo.GeneralRegister)

$("#form-category").on("submit",function(event){
    event.preventDefault()
})

$("#send-form-category").on("click",async function(){
    await api.registerCategory(document.getElementById("category-name").value)
})