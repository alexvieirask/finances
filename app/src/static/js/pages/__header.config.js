import *  as __global from "../utils/utils.global.js"

const { Session, RedirectTo } = __global

RedirectTo.ButtonRedirectOnClick("#home-option",RedirectTo.Home)
RedirectTo.ButtonRedirectOnClick("#account-option",RedirectTo.Account)
RedirectTo.ButtonRedirectOnClick("#transaction-option",RedirectTo.TransactionSimple)
RedirectTo.ButtonRedirectOnClick("#accountpayable-option",RedirectTo.AccountsPayable)
RedirectTo.ButtonRedirectOnClick("#accountreceivable-option",RedirectTo.AccountsReceivable)
RedirectTo.ButtonRedirectOnClick("#rebate-option",RedirectTo.Rebate)
RedirectTo.ButtonRedirectOnClick("#general-register-option",RedirectTo.GeneralRegister)
RedirectTo.ButtonRedirectOnClick("#settings-option",RedirectTo.Settings)
RedirectTo.ButtonRedirectOnClick("#leave-option",Session.destroy)

async function setHeaderData(){
    try{
        if (Session.USER){
            Session.USER.then(user=>{
                var headerUsername = document.querySelector("#header-username-span")
                
                headerUsername.textContent = `@${user.username}`
               
                var body = document.querySelector("body")
                
                body.style.display = 'block'
            }).catch(error=>{
                console.log(error)
            })
          
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