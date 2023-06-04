import *  as __global from "./__utils.global.js"

const { RedirectTo, Session, MathConversions } = __global
const { convertMoneyIntegerToFloat } = MathConversions

document.querySelector("#button-new-account").addEventListener("click",RedirectTo.FormAccount)
document.querySelector("#btn-more-details").addEventListener("click",RedirectTo.AccountDetails)

createTableAccounts()
createTableMaxAmount()

async function handleGetAccounts(){
    try{
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/user/info/all_accounts?limit=5`
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

async function handleGetMaxAmount(){
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

async function createTableAccounts(){
    try{
        var Tbody = document.querySelector("#t-body-accounts")
        var table = localStorage.getItem("__TABLE__ACCOUNTS__")

        if(!table){
            var items = await handleGetAccounts()
            const itemsExists = items.details.length > 0

            if (itemsExists){
                table = items.details.map(item =>{
                    return `<tr> 
                                <td>${item.account_name}</td>
                                <td class="font-weight-bold">R$ ${convertMoneyIntegerToFloat(item.amount)}</td>
                            </tr>`
                })

                localStorage.setItem("__TABLE__ACCOUNTS__",JSON.stringify(table))
            }   
        }     
        else{
            table = JSON.parse(table); 
        }
    } 
    catch(error){
        console.log(error)
    }    
    finally{
        Tbody.innerHTML = Array.isArray(table) ? table.join("") : "";
    }
}   

async function createTableMaxAmount(){
    try{
        var Tbody = document.querySelector("#t-body-max-amount")
        var table = localStorage.getItem("__TABLE__MAX_AMOUNT__")
            
        if (!table){
            var item = await handleGetMaxAmount()
            var itemExists = item.details !== null
    
            if (itemExists){
                const { account_name, amount} = item.details
                table = `
                    <tr> 
                        <td style="background-color:#f2f2f2;">${account_name}</td>
                        <td style="background-color:#f2f2f2;" class="font-weight-bold">R$ ${convertMoneyIntegerToFloat(amount)}</td>
                    </tr>`

                    localStorage.setItem("__TABLE__MAX_AMOUNT__",table)
            }
        }
    }
    catch(error){
        console.log(error)
    } 
    finally{
        Tbody.innerHTML = table
    }
}