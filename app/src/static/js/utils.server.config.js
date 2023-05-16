function handleAdressIP(){
    const URL = document.URL;
    const PROTOCOL = "http://";
    var ENDERECO_IP = URL.substring(PROTOCOL.length);
    const COLON_POSITION = ENDERECO_IP.indexOf(":");
    return ENDERECO_IP.substring(0, COLON_POSITION);
}

export { handleAdressIP }