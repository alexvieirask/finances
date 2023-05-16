import * as _utilsServerConfig from './utils.server.config.js'
import * as Toastr from './utils.toastr.js'
import * as Loading from './utils.loading.js'

var { handleAdressIP } = _utilsServerConfig

const JWT = sessionStorage.getItem("JWT");
const ENDERECO_IP = handleAdressIP()

export { ENDERECO_IP, JWT, Toastr, Loading }

