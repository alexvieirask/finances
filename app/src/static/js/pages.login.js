import *  as __global from "./__utils.global.js"

const {Session, Toastr,RedirectTo, Form } = __global

function toggleResetPswd(event){
    event.preventDefault();
    Form.removeErrorMessage()
    defaultResetPasswordContainer()
    resetForms()

    $('#logreg-forms .form-signin').toggle() 
    $('#logreg-forms .form-reset').toggle() 
}

function toggleSignUp(event){
    event.preventDefault();
    Form.removeErrorMessage()
    resetForms()

    $('#logreg-forms .form-signin').toggle(); 
    $('#logreg-forms .form-signup').toggle(); 
}



$(()=>{
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    $('#logreg-forms #btn-signup').click(toggleSignUp);
    $('#logreg-forms #cancel_signup').click(toggleSignUp);
    $('#submit-signup').click(handleSignup);
    $("#submit-signin").click(handleSignin);
    $("#submit-reset").click(handleRedefinePassword);
    document.getElementById("resetEmail").value = 'alexvieiradias2016@gmail.com' 

})

async function handleSignup(event){
    event.preventDefault();
    let fullName = document.getElementById("user-fullname").value 
    let userName = document.getElementById("user-name").value 
    let userEmail = document.getElementById("user-email").value 
    let userPassword = document.getElementById("user-pass").value 
    let userRepeatPassword = document.getElementById("user-repeatpass").value 

    let url = `http://${Session.IP_ADDRESS}:5000/signup/auth`
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer '${Session.JWT}'`
        },
        body:  JSON.stringify({
            fullname                :       fullName,
            username                :       userName,
            useremail               :       userEmail,
            userpassword            :       userPassword,
            userrepeatpassword      :       userRepeatPassword
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
        Toastr.show('success','Account successfully created.')
        document.querySelector(".form-signup").reset()
        $('.form-signup').toggle() 
        $('.form-signin').toggle() 
        
    }
}

async function handleSignin(event){
    event.preventDefault()
    let userEmail = document.getElementById("inputUsername").value 
    let userPassword = document.getElementById("inputPassword").value 

    let url = `http://${Session.IP_ADDRESS}:5000/signin/auth`
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({
            useremail               :       userEmail,
            userpassword            :       userPassword,
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

async function handleRedefinePassword(event){
    event.preventDefault()
    var button = document.querySelector("#submit-reset")
    button.disabled = true
    

    let userEmail = document.getElementById("resetEmail").value 

    let url = `http://${Session.IP_ADDRESS}:5000/forgout_password`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({
            useremail               :       userEmail,
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
    }else{
        Toastr.show('warning','Recovery email sent.')
        document.getElementById("submit-reset").style.display = 'none'
        
        var HTML_EMAIL = document.getElementById("resetEmail")
        HTML_EMAIL.readOnly  = true
      
        const HTML_HR = document.createElement('hr')
        const HTML_INPUT_TOKEN = document.createElement('input')
        const HTML_INPUT_NEW_PASSWORD = document.createElement('input')
        const HTML_INPUT_NEW_PASSWORD_REPEAT = document.createElement('input')
        const HTML_SUBMIT_NEW_PASSWORD = document.createElement('button')

        HTML_INPUT_TOKEN.placeholder = 'Token'
        HTML_INPUT_NEW_PASSWORD.placeholder = 'New password'
        HTML_INPUT_NEW_PASSWORD_REPEAT.placeholder = 'Repeat password'
        HTML_SUBMIT_NEW_PASSWORD.textContent = 'Submit'

        HTML_INPUT_NEW_PASSWORD.type = 'password'
        HTML_INPUT_NEW_PASSWORD_REPEAT.type = 'password'

        HTML_HR.id = 'hr'
        HTML_INPUT_TOKEN.id = "reset-password-input-token"
        HTML_INPUT_NEW_PASSWORD.id = "reset-password-input-new-password"
        HTML_INPUT_NEW_PASSWORD_REPEAT.id = "reset-password-input-new-password-repeat"
        HTML_SUBMIT_NEW_PASSWORD.id = "reset-password-submit"
        
        HTML_HR.classList.add('bg-primary','mt-3')
        HTML_INPUT_TOKEN.classList.add("form-control")
        HTML_INPUT_NEW_PASSWORD.classList.add("form-control")
        HTML_INPUT_NEW_PASSWORD_REPEAT.classList.add("form-control")
        
        HTML_SUBMIT_NEW_PASSWORD.classList.add('btn','btn-primary','btn-block', 'mt-3')
        HTML_SUBMIT_NEW_PASSWORD.addEventListener("click", handleChangePassword)


        HTML_FORM_CONTAINER.appendChild(HTML_HR)
        HTML_FORM_CONTAINER.appendChild(HTML_INPUT_TOKEN)
        HTML_FORM_CONTAINER.appendChild(HTML_INPUT_NEW_PASSWORD)
        HTML_FORM_CONTAINER.appendChild(HTML_INPUT_NEW_PASSWORD_REPEAT)


        HTML_FORM_CONTAINER.insertAdjacentElement('afterend',HTML_SUBMIT_NEW_PASSWORD)
       
    }
    button.disabled = false
}


async function handleChangePassword(event){
    event.preventDefault()

    let userEmail = document.getElementById("resetEmail").value
    let userResetPasswordToken =  document.querySelector("#reset-password-input-token").value
    let userResetPasswordNewPassword =  document.querySelector("#reset-password-input-new-password").value
    let userResetPasswordRepeatNewPassword =  document.querySelector("#reset-password-input-new-password-repeat").value


    let url = `http://${Session.IP_ADDRESS}:5000/redefine_password`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({
            useremail                           :       userEmail,
            userresetpasswordtoken              :       userResetPasswordToken,
            userresetpasswordnewpassword        :       userResetPasswordNewPassword,
            userresetpasswordrepeatnewpassword  :       userResetPasswordRepeatNewPassword
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


function defaultResetPasswordContainer(){
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

function resetForms(){
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