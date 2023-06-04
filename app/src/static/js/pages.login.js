import *  as __global from "./__utils.global.js"

const { Session, Toastr,RedirectTo, Form } = __global

document.querySelector("#logreg-forms #forgot_pswd").addEventListener("click",toggleResetPswd)
document.querySelector("#logreg-forms #cancel_reset").addEventListener("click",toggleResetPswd)
document.querySelector("#logreg-forms #btn-signup").addEventListener("click",toggleSignUp)
document.querySelector("#logreg-forms #cancel_signup").addEventListener("click",toggleSignUp)
document.querySelector("#submit-signup").addEventListener("click",handleSignup)
document.querySelector("#submit-signin").addEventListener("click",handleSignin)
document.querySelector("#submit-reset").addEventListener("click",handleRedefinePassword)


function toggleResetPswd(event){
    try{
        event.preventDefault();
        Form.removeErrorMessage()
        defaultResetPasswordContainer()
        FormReset()
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
        FormReset()
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
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/signup/auth`
        let response = await fetch(URL_REQUEST, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer '${Session.JWT}'`
            },
            body:  JSON.stringify({
                fullname                :       document.getElementById("user-fullname").value,
                username                :       document.getElementById("user-name").value,
                useremail               :       document.getElementById("user-email").value,
                userpassword            :       document.getElementById("user-pass").value,
                userrepeatpassword      :       document.getElementById("user-repeatpass").value 
            })
        });
    
        const responseData = await response.json()
        Form.removeErrorMessage()
    
        var HTML_FORM_CONTAINER = document.querySelector(".items-input")
        var HTML_SPAN = document.createElement("span")
    
        if (responseData.status != 200){
            HTML_SPAN.classList.add("form-span-error")
            HTML_SPAN.textContent = responseData.details
            HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
        }
        else{
            Toastr.show('success','Conta criada com sucesso.')
            document.querySelector(".form-signup").reset()
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
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/signin/auth`
        
        let response = await fetch(URL_REQUEST, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:  JSON.stringify({
                useremail               :       document.getElementById("inputUsername").value,
                userpassword            :       document.getElementById("inputPassword").value,
            })
        });
    
        const responseData = await response.json()
    
        Form.removeErrorMessage()
    
        var HTML_FORM_CONTAINER = document.querySelector(".items-input-signin")
        var HTML_SPAN = document.createElement("span")
        
        if (responseData.status != 200){
            HTML_SPAN.classList.add("form-span-error")
            HTML_SPAN.textContent = responseData.details
            HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
        } else{
            Session.JWT = responseData.details
            await Session.CURRENT_USER()
            RedirectTo.Home()
        }
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
    
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/forgout_password`;
      
        let response = await fetch(URL_REQUEST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            useremail: document.getElementById("resetEmail").value,
          })
        });
      
        const responseData = await response.json();
        Form.removeErrorMessage();
      
        var HTML_FORM_CONTAINER = document.querySelector(".items-input-reset");
        var HTML_SPAN = document.createElement("span");

        var textEmail = document.getElementById("resetEmail").value
        console.log(textEmail)
      
        if (responseData.status != 200) {
          HTML_SPAN.classList.add("form-span-error");
          HTML_SPAN.textContent = responseData.details;
          HTML_FORM_CONTAINER.appendChild(HTML_SPAN);
        } 
        else {
            Toastr.show('warning', 'E-mail de recuperação de senha encaminhado.');
            document.getElementById("submit-reset").style.display = 'none';

            document.getElementById("resetEmail").readOnly = true
        
            
            const HTML_HR = '<hr id="hr" class="bg-primary mt-3">';
            const HTML_INPUT_TOKEN = '<input id="reset-password-input-token" class="form-control" placeholder="Token">';
            const HTML_INPUT_NEW_PASSWORD = '<input id="reset-password-input-new-password" class="form-control" placeholder="Nova senha" type="password">';
            const HTML_INPUT_NEW_PASSWORD_REPEAT = '<input id="reset-password-input-new-password-repeat" class="form-control" placeholder="Confirme a senha" type="password">';
            const HTML_SUBMIT_NEW_PASSWORD = '<button id="reset-password-submit" class="btn btn-primary btn-block mt-3">Confirmar</button>';
        
            HTML_FORM_CONTAINER.innerHTML += HTML_HR;
            HTML_FORM_CONTAINER.innerHTML += HTML_INPUT_TOKEN;
            HTML_FORM_CONTAINER.innerHTML += HTML_INPUT_NEW_PASSWORD;
            HTML_FORM_CONTAINER.innerHTML += HTML_INPUT_NEW_PASSWORD_REPEAT;
            HTML_FORM_CONTAINER.insertAdjacentHTML('afterend', HTML_SUBMIT_NEW_PASSWORD);
            document.getElementById("reset-password-submit").addEventListener("click", handleChangePassword);
            document.getElementById("resetEmail").value = textEmail
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
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/redefine_password`
        let response = await fetch(URL_REQUEST, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:  JSON.stringify({
                useremail                           :      document.getElementById("resetEmail").value ,
                userresetpasswordtoken              :      document.querySelector("#reset-password-input-token").value,
                userresetpasswordnewpassword        :      document.querySelector("#reset-password-input-new-password").value,
                userresetpasswordrepeatnewpassword  :      document.querySelector("#reset-password-input-new-password-repeat").value
            })
        });
    
        const responseData = await response.json()
        Form.removeErrorMessage()
        
        var HTML_FORM_CONTAINER = document.querySelector(".items-input-reset")
        var HTML_SPAN = document.createElement("span")
    
        if (responseData.status != 200){
            HTML_SPAN.classList.add("form-span-error")
            HTML_SPAN.textContent = responseData.details
            HTML_FORM_CONTAINER.appendChild(HTML_SPAN)
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
        var tokenInput = document.getElementById("reset-password-input-token")
        var newPassword =  document.getElementById("reset-password-input-new-password")
        var hr = document.getElementById('hr')
        var repeatNewPassword =  document.getElementById("reset-password-input-new-password-repeat")
        var submit = document.getElementById("reset-password-submit")
        
        if(tokenInput) tokenInput.remove()
        if(newPassword) newPassword.remove()
        if(repeatNewPassword) repeatNewPassword.remove()
        if(submit) submit.remove()
        if(hr) hr.remove()
    
        var HTML_EMAIL = document.getElementById("resetEmail")
        HTML_EMAIL.readOnly  = false
    }
    catch(error){
        console.log(error)
    }
}

function FormReset(){
    try{
        document.querySelector('#inputUsername').value = ''
        document.querySelector('#inputPassword').value = ''
        document.querySelector('#resetEmail').value = ''
        document.querySelector('#user-fullname').value = ''
        document.querySelector('#user-name').value = ''
        document.querySelector('#user-email').value = ''
        document.querySelector('#user-pass').value = ''
        document.querySelector('#user-repeatpass').value = ''
        document.getElementById("submit-reset").style.display = 'block'
    }
    catch(error){
        console.log(error)
    }
}