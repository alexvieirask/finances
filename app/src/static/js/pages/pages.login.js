import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.login.js"
const { Session, Toastr,RedirectTo, Form, MessageInput, Button } = __global

Button.onClick("#logreg-forms #forgot_pswd",      toggleResetPswd)
Button.onClick("#logreg-forms #cancel_reset",     toggleResetPswd)
Button.onClick("#logreg-forms #btn-signup",       toggleSignUp)
Button.onClick("#logreg-forms #cancel_signup",    toggleSignUp)

Form.onSubmit(".form-signup",           handleSignup)
Form.onSubmit(".form-signin",           handleSignin)
Form.onSubmit(".form-reset",            handleRedefinePassword)

function toggleResetPswd(){
    try{
        MessageInput.reset()
        defaultResetPasswordContainer()
        $('#logreg-forms .form-signin').toggle() 
        $('#logreg-forms .form-reset').toggle() 
    }
    catch(error){
        console.log(error)
    }
}
function toggleSignUp(){
    try{
        MessageInput.reset()
        $('#logreg-forms .form-signin').toggle(); 
        $('#logreg-forms .form-signup').toggle(); 
    }
    catch(error){
        console.log(error)
    }
}
function defaultResetPasswordContainer(){
    try{
        if($("#reset-password-input-token")) $("#reset-password-input-token").remove()
        if($("#reset-password-input-new-password")) $("reset-password-input-new-password").remove()
        if($("#hr")) $("#hr").remove()
        if($("#reset-password-input-new-password-repeat")) $("#reset-password-input-new-password-repeat").remove()
        if($("#reset-password-submit")) $("#reset-password-submit").remove()
        $("#resetEmail").attr("readOnly",false)
    }
    catch(error){
        console.log(error)
    }
}

async function handleSignup(event){
    try{
        Form.handleRequest(event,".form-signup",async function(){
            let fullname            = document.getElementById("user-fullname").value
            let username            = document.getElementById("user-name").value
            let useremail           = document.getElementById("user-email").value
            let userpassword        = document.getElementById("user-pass").value
            let userrepeatpassword  = document.getElementById("user-repeatpass").value
    
            const responseData = await api.signUp(fullname,username,useremail,userpassword,userrepeatpassword)
            
            if (responseData.status != 200){
                MessageInput.show(responseData.details, 1,'.items-input');
            }
            else{
                Toastr.show('success','Conta criada com sucesso.')
                Form.reset(".form-signup")
                $('.form-signup').toggle() 
                $('.form-signin').toggle() 
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

async function handleSignin(event){
    try{
        Form.handleRequest(event,".form-signin", async function(){
            let useremail = document.getElementById("inputEmail").value
            let userpassword = document.getElementById("inputPassword").value
            const responseData = await api.signIn(useremail,userpassword)
        
            if (responseData.status != 200){
                MessageInput.show(responseData.details,1,".items-input-signin")
            } else{
                Session.JWT = responseData.details
                await Session.CURRENT_USER()
                RedirectTo.Home()
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

async function handleRedefinePassword(event) {
    try {
        Form.handleRequest(event,".form-reset",async function(){
            var HTML_FORM_CONTAINER = document.querySelector(".items-input-reset");
            var useremail = document.getElementById("resetEmail")
            var saveuseremail = useremail.value
    
            const responseData = await api.sendEmailRedefinePassword(useremail.value)
          
            if (responseData.status != 200) {
                MessageInput.show(responseData.details, 1, ".items-input-reset")
            } 
            else {
                Toastr.show('warning', 'E-mail de recuperação de senha encaminhado.');
                $("#submit-reset").hide()
                const HTML = `
                <hr id="hr" class="bg-primary mt-3">
                <input id="reset-password-input-token" class="form-control" placeholder="Token">
                <input id="reset-password-input-new-password" class="form-control" placeholder="Nova senha" type="password">
                <input id="reset-password-input-new-password-repeat" class="form-control" placeholder="Confirme a senha" type="password">
                `
                HTML_FORM_CONTAINER.innerHTML += HTML
                HTML_FORM_CONTAINER.insertAdjacentHTML('afterend', '<button id="reset-password-submit" class="btn btn-primary btn-block mt-3">Confirmar</button>');
                useremail.value = saveuseremail
                useremail.readOnly = true
                
                Form.onSubmit(".form-reset",handleChangePassword)
            }
        }
    )
    }
    catch (error) {
      console.log(error)
    }
}

async function handleChangePassword(event){
    try{
        Form.handleRequest(event,".form-reset", async function(){
            let useremail                   = document.getElementById("resetEmail").value
            let userresetpasswordtoken      = document.getElementById("reset-password-input-token").value
            let usernewpassword             = document.getElementById("reset-password-input-new-password").value
            let usernewpasswordrepeat       = document.getElementById("reset-password-input-new-password-repeat").value
          
            const responseData = await api.changePassword(useremail,userresetpasswordtoken,usernewpassword,usernewpasswordrepeat)
            
            if (responseData.status != 200){
                MessageInput.show(responseData.details,1,'.items-input-reset')
            } else{
                toggleResetPswd()
                defaultResetPasswordContainer()
            }
        })
    }
    catch(error){
        console.log(error)
    }
}