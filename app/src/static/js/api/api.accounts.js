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

async function insert_new_account(account_name, opening_balance){
    const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/form/new_account`
        
    let response = await fetch(URL_REQUEST, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${Session.JWT}`
        },
        body:  JSON.stringify({
            account_name        :       account_name,
            opening_balance     :       MathConversions.convertMoneyFloatToInteger(opening_balance).toString()
        })
    });

    return response.json()
}


export { get_all_accounts, get_account_with_the_highest_balance, insert_new_account }