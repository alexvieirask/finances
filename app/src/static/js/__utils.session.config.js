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

    static get USER(){
        return JSON.parse(sessionStorage.getItem("user")) 
    }

    static set JWT(value){
        sessionStorage.setItem("JWT",value)
    }

    static set USER(value){
        sessionStorage.setItem("user",value)
    }

    static async CURRENT_USER(){
        if (Session.JWT){
            var user = sessionStorage.getItem("user")
            if (!user || Object.keys(user).length === 0) {
                const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/user/info`;
                
                let response = await fetch(URL_REQUEST, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Session.JWT}`
                  }
                });
              
                user = await response.json();

                sessionStorage.setItem("user", JSON.stringify(user.details));
                return user.details;
            } 
            else {
                return JSON.parse(user)
            }
        }
    }

    static destroy(){
        sessionStorage.removeItem("JWT")
        sessionStorage.removeItem("user")
        RedirectTo.Login()
    }

}

export { Session }