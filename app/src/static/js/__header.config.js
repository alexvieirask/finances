import *  as __global from "./__utils.global.js"

const { Session, RedirectTo } = __global

document.querySelector("#home-option").addEventListener("click",RedirectTo.Home)
document.querySelector("#account-option").addEventListener("click",RedirectTo.Account)
document.querySelector("#transaction-option").addEventListener("click",RedirectTo.Transaction)
document.querySelector("#accountpayable-option").addEventListener("click",RedirectTo.AccountsPayable)
document.querySelector("#accountreceivable-option").addEventListener("click",RedirectTo.AccountsReceivable)
document.querySelector("#rebate-option").addEventListener("click",RedirectTo.Rebate)
document.querySelector("#settings-option").addEventListener("click",RedirectTo.Settings)
document.querySelector("#leave-option").addEventListener("click",Session.destroy)

function setHeaderData(){
    try{
        if (Session.USER){
            var headerUsername = document.querySelector("#header-username-span")
            
            headerUsername.textContent = `@${Session.USER.username}`
           
            var body = document.querySelector("body")
            
            body.style.display = 'block'
        }
       else{
            if (window.location != '/' ){
                RedirectTo.Login()
            }
        }

    }
    catch(error){
        console.log(error)
    }
}

setHeaderData()