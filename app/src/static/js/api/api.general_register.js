import *  as __global from "../utils/utils.global.js"
const { Session } = __global

async function insert_new_category(category_name){
    try{
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/general_register/form_category`

        let response = await fetch(URL_REQUEST,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${Session.JWT}`
            },
            body:  JSON.stringify({
                category_name        :       category_name
            })
        })
        
        return await response.json()

    }
    catch(error){
        console.log(error)
    }
}

export { insert_new_category }