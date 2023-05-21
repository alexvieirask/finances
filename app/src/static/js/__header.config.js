import *  as __global from "./__utils.global.js"

const { CURRENT_USER } = __global

function setHeaderData(){
    const TOKEN = "@"

    if( CURRENT_USER.status == 200){
        var currentUser = CURRENT_USER.details

        var __HTML_HEADER_USERNAME = document.querySelector("#header-username-span")

        __HTML_HEADER_USERNAME.textContent = `${TOKEN}${currentUser.username}`
    }
}


/* Configurações de inicialização */ 
setHeaderData()