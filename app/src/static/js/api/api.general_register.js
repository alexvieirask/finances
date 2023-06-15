import *  as __global from "../utils/utils.global.js"
const { Session } = __global

async function registerCategory(){
    try{
        var button = document.getElementById("send-form-category")
        button.disabled = true;

        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/general_register/form_category`

        let response = await fetch(URL_REQUEST,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${Session.JWT}`
            },
            body:  JSON.stringify({
                category_name        :       document.getElementById("category-name").value,
            })
        })
        

        button.disabled = false;
        return await response.json()


    }
    catch(error){
        console.log(error)
    }
}

export { registerCategory }