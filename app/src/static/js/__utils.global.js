import * as _utilsServerConfig from './__utils.server.config.js'
import * as Toastr from './__utils.toastr.js'

var { handleAdressIP } = _utilsServerConfig

const JWT = sessionStorage.getItem("JWT");
const ENDERECO_IP = handleAdressIP()

async function handleSearchUserInfo(){
    if (JWT){
        var url = `http://${ENDERECO_IP}:5000/user/info`

        const cache = await caches.open('my-cache')
        const responseCache = await cache.match(url)

        if (responseCache){
            return responseCache.json()
        } else{
            const responseServer = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization' : `Bearer ${JWT}`
                }
            });
            
            await cache.put(url, responseServer.clone())
            
            return responseServer.json()
        }
    } else{
       caches.delete('my-cache')
    }
}

var CURRENT_USER = await handleSearchUserInfo()

console.log("CURRENT_USER:",CURRENT_USER)

export { ENDERECO_IP, JWT, Toastr, CURRENT_USER }