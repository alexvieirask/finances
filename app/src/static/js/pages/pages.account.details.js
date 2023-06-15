import *  as __global from "../utils/utils.global.js"
import *  as api from "../api/api.accounts.js"

const { RedirectTo, Session, Loading } = __global
RedirectTo.ButtonRedirectOnClick("#return-page",RedirectTo.Account)
createTable()

async function createTableAccounts(){
    try{
        var Tbody = document.querySelector("#t-body-all-accounts")
        var items = await api.get_all_accounts()
        var table = ''

        const itemsExists = items.details.length > 0

        if (itemsExists){
            table = items.details.map(item =>{
                return `<tr> 
                            <td>
                            ${item.account_name}
                            </td>
                        </tr>`
            })
        }   
    }    
    catch(error){
        console.log(error)
    }    
    finally{
        Tbody.innerHTML = Array.isArray(table) ? table.join("") : "";

        $('#all-accounts').DataTable({
            lengthChange: false,
            pageLength: 7, 
            language: {
                url: `http://${Session.IP_ADDRESS}:5000/json/languageDataTable.json`
            },
            columnDefs: [
                {
                   targets: 0, 
                   render: function(data) {
                      return `  <div class="d-flex" style="justify-content:space-between;">
                                    <div><a href="${data}">${data}</a></div>
                                    <div">
                                        <a>Excluir</a> 
                                        <a>Editar</a
                                    </div>
                                </div>`
                   }
                }
             ]
        });
    }
}   

async function createTable(){
    Loading.show()
    await createTableAccounts()
    Loading.hide()
    document.querySelector(".main-page").style.display = 'block'
}