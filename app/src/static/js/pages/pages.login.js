import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.login.js"
const { Session, Toastr,RedirectTo, Form } = __global

RedirectTo.ButtonRedirectOnClick("#logreg-forms #forgot_pswd",toggleResetPswd)
RedirectTo.ButtonRedirectOnClick("#logreg-forms #cancel_reset",toggleResetPswd)
RedirectTo.ButtonRedirectOnClick("#logreg-forms #btn-signup",toggleSignUp)
RedirectTo.ButtonRedirectOnClick("#logreg-forms #cancel_signup",toggleSignUp)
RedirectTo.ButtonRedirectOnClick("#submit-signup",handleSignup)
RedirectTo.ButtonRedirectOnClick("#submit-signin",handleSignin)
RedirectTo.ButtonRedirectOnClick("#submit-reset",handleRedefinePassword)

function toggleResetPswd(event){
    try{
        event.preventDefault();
        
        Form.removeErrorMessage()
        
        defaultResetPasswordContainer()

        $('#logreg-forms .form-signin').toggle() 
        $('#logreg-forms .form-reset').toggle() 
    }
    catch(error){
        console.log(error)
    }
}

function toggleSignUp(event){
    try{
        event.preventDefault();
        Form.removeErrorMessage()
        $('#logreg-forms .form-signin').toggle(); 
        $('#logreg-forms .form-signup').toggle(); 
    }
    catch(error){
        console.log(error)
    }
}


async function handleSignup(event){
    try{
        event.preventDefault();

        let fullname = document.getElementById("user-fullname").value
        let username = document.getElementById("user-name").value
        let useremail = document.getElementById("user-email").value
        let userpassword = document.getElementById("user-pass").value
        let userrepeatpassword  = document.getElementById("user-repeatpass").value

        const responseData = await api.signUp(fullname,username,useremail,userpassword,userrepeatpassword)
        
        Form.removeErrorMessage()
        if (responseData.status != 200){
            Form.removeErrorMessage(responseData.details,'.items-input');
        }
        else{
            Toastr.show('success','Conta criada com sucesso.')
            $(".form-signup").reset()
            $('.form-signup').toggle() 
            $('.form-signin').toggle() 
        }
    }
    catch(error){
        console.log(error)
    }
}

async function handleSignin(event){
    try{
        event.preventDefault()
        var button = document.querySelector("#submit-signin")
        button.disabled = true

        let useremail = document.getElementById("inputEmail").value
        let userpassword = document.getElementById("inputPassword").value

        const responseData = await api.signIn(useremail,userpassword)
    
        Form.removeErrorMessage()
        if (responseData.status != 200){
            Form.showErrorMessage(responseData.details,".items-input-signin")
        } else{
            Session.JWT = responseData.details
            await Session.CURRENT_USER()
            RedirectTo.Home()
        }
        button.disabled = false
    }
    catch(error){
        console.log(error)
    }
}

async function handleRedefinePassword(event) {
    try{
        event.preventDefault();
        var button = document.querySelector("#submit-reset");
        button.disabled = true;
        
        let useremail = document.getElementById("resetEmail").value

        const responseData = await api.sendEmailRedefinePassword(useremail)
        var HTML_FORM_CONTAINER = document.querySelector(".items-input-reset");
        
        Form.removeErrorMessage();
        if (responseData.status != 200) {
          Form.showErrorMessage(responseData.details,".items-input-reset")
        } 
        else {
            Toastr.show('warning', 'E-mail de recuperação de senha encaminhado.');
            $("#submit-reset").hide()

            var emailInput = document.getElementById("resetEmail")
            emailInput.readOnly = true

            const HTML = `
                        <hr id="hr" class="bg-primary mt-3">
                        <input id="reset-password-input-token" class="form-control" placeholder="Token">
                        <input id="reset-password-input-new-password" class="form-control" placeholder="Nova senha" type="password">
                        <input id="reset-password-input-new-password-repeat" class="form-control" placeholder="Confirme a senha" type="password">
            `

            HTML_FORM_CONTAINER.innerHTML += HTML
            HTML_FORM_CONTAINER.insertAdjacentHTML('afterend', '<button id="reset-password-submit" class="btn btn-primary btn-block mt-3">Confirmar</button>');
            document.getElementById("reset-password-submit").addEventListener("click", handleChangePassword);
         
        }
        button.disabled = false;
    }
    catch(error){
        console.log(error)
    } 
  }  

async function handleChangePassword(event){
    try{
        event.preventDefault()
        
        let useremail = document.getElementById("resetEmail").value
        let userresetpasswordtoken = document.getElementById("reset-password-input-token").value
        let usernewpassword = document.getElementById("reset-password-input-new-password").value
        let usernewpasswordrepeat = document.getElementById("reset-password-input-new-password-repeat").value
      
        const responseData = await api.changePassword(useremail,userresetpasswordtoken,usernewpassword,usernewpasswordrepeat)
        
        Form.removeErrorMessage()
        if (responseData.status != 200){
            Form.showErrorMessage(responseData.details,'.items-input-reset')
        } else{
            toggleResetPswd()
            defaultResetPasswordContainer()
     
        }
    }
    catch(error){
        console.log(error)
    }
}

function defaultResetPasswordContainer(){
    try{
        if($("#reset-password-input-token")) $("#reset-password-input-token").remove()
        if($("#reset-password-input-new-password")) $("reset-password-input-new-password").remove()
        if($("hr")) $("hr").remove()
        if($("#reset-password-input-new-password-repeat")) $("#reset-password-input-new-password-repeat").remove()
        if($("#reset-password-submit")) $("#reset-password-submit").remove()
        
        $("#resetEmail").attr("readOnly",false)
  
    }
    catch(error){
        console.log(error)
    }
}