import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.accounts.js"

const { RedirectTo, MathConversions, Loading } = __global
const { convertMoneyIntegerToFloat } = MathConversions

RedirectTo.ButtonRedirectOnClick("#button-new-account",RedirectTo.FormAccount)
RedirectTo.ButtonRedirectOnClick("#btn-more-details",RedirectTo.AccountDetails)

createTables()

async function createTableAccounts(){
    try{
        var Tbody = document.querySelector("#t-body-accounts")
        var table = ''
        var items = await api.get_all_accounts()
        const itemsExists = items.details.length > 0

        if (itemsExists){
            table = items.details.map(item =>{
                return `<tr> 
                            <td>${item.account_name}</td>
                            <td class="font-weight-bold">R$ ${convertMoneyIntegerToFloat(item.amount)}</td>
                        </tr>`
            })
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
        var table = ''
            
        var item = await api.get_account_with_the_highest_balance()
        var itemExists =  item.details != null
        
        if (itemExists){
                const {account_name, amount} = item.details
                table = `
                    <tr> 
                        <td style="background-color:#f2f2f2;">${account_name}</td>
                        <td style="background-color:#f2f2f2;" class="font-weight-bold">R$ ${convertMoneyIntegerToFloat(amount)}</td>
                    </tr>`
        }
    }
    catch(error){
        console.log(error)
    } 
    finally{
        Tbody.innerHTML = table
    }
}

async function loadData(){
    await Promise.all([
        createTableAccounts(),
        createTableMaxAmount()
    ])
}

async function createTables(){
    Loading.show()
    await loadData()
    Loading.hide()
    document.querySelector(".main-page").style.display = 'block'
}