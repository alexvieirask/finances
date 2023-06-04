import { RedirectTo } from './__utils.redirect.pages.js'

class Session{
    URL = document.URL;
    PROTOCOL = "http://";

    static get IP_ADDRESS(){
        const session = new Session();
        var ENDERECO_IP = session.URL.substring(session.PROTOCOL.length);
        var COLON_POSITION = ENDERECO_IP.indexOf(":");
        return ENDERECO_IP.substring(0, COLON_POSITION);
    }

    static get JWT(){
        return sessionStorage.getItem("JWT")
    }


    static get listLocalStorage(){
        const keys = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            keys.push(key);
        }
        return keys;
    }

    static get listSessionStorage(){
        const keys = [];

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            keys.push(key);
        }
        return keys;
    }

    static set JWT(value){
        sessionStorage.setItem("JWT",value)
    }

    static get USER(){
        return new Promise(async (resolve, reject) => {
            try {
              const user = await Session.CURRENT_USER();
              resolve(user);
            } catch (error) {
              reject(error);
            }
          });
    }


    static async CURRENT_USER(){
        if (Session.JWT){
            const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/user/info`;
                
            let response = await fetch(URL_REQUEST, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Session.JWT}`
                }
            });
            
            const responseData = await response.json();

            return responseData.details;
        }
    }

    static destroy(){
        Session.listSessionStorage.forEach(item=>{
            sessionStorage.removeItem(item)
        })

        Session.listLocalStorage.forEach(item=>{
            localStorage.removeItem(item)
        })

        RedirectTo.Login()
    }

}

export { Session }