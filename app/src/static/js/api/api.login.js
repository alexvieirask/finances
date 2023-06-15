import *  as __global from "../utils/utils.global.js"
const { Session } = __global


async function signIn(useremail,userpassword){
    const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/signin/auth` 
    let response = await fetch(URL_REQUEST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({
            useremail               :       useremail,
            userpassword            :       userpassword,
        })
    });

    return response.json()
}

async function signUp(fullname,username,useremail,userpassword,userrepeatpassword){
    const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/signup/auth`
    let response = await fetch(URL_REQUEST, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer '${Session.JWT}'`
        },
        body:  JSON.stringify({
            fullname                :      fullname,
            username                :      username,
            useremail               :      useremail,
            userpassword            :      userpassword,
            userrepeatpassword      :      userrepeatpassword 
        })
    });

    return response.json()
}

async function sendEmailRedefinePassword(useremail){
    const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/forgout_password`;
    let response = await fetch(URL_REQUEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        useremail: useremail
      })
    });
  
    return response.json();
}

async function changePassword(useremail,userpasswordtoken,newpassword,repeatnewpassword){
    const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/redefine_password`
    let response = await fetch(URL_REQUEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify({
          useremail                           :      useremail ,
          userresetpasswordtoken              :      userpasswordtoken,
          userresetpasswordnewpassword        :      newpassword,
          userresetpasswordrepeatnewpassword  :      repeatnewpassword
      })
  });

  return response.json()
}


export { signIn, signUp,sendEmailRedefinePassword, changePassword  }