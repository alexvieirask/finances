import *  as __global from "../utils/utils.global.js"
const { Session } = __global

async function get_all_accounts(limit){
    try{
        limit = (!limit) ? 0 : limit;

        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/user/info/all_accounts?limit=${limit}`
        let response = await fetch(URL_REQUEST, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${Session.JWT}`
            }
        });      
        return response.json()
    }
    catch(error){
        console.log(error)
    }
}

async function get_account_with_the_highest_balance(){
    try{
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/account/max_amount`
        let response = await fetch(URL_REQUEST, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${Session.JWT}`
            }
        });      
        return response.json()
    }
    catch(error){
        console.log(error)
    }
}

export { get_all_accounts, get_account_with_the_highest_balance }