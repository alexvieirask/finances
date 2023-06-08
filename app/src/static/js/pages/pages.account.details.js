import *  as __global from "../utils/utils.global.js"

const { RedirectTo, Session, MathConversions, Loading } = __global


document.querySelector("#return-page").addEventListener("click",RedirectTo.Account)


createTable()

async function handleGetAccounts(){
    try{
        const URL_REQUEST = `http://${Session.IP_ADDRESS}:5000/user/info/all_accounts`
        let response = await fetch(URL_REQUEST, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${Session.JWT}`
            }
        });      
        return response.json()
    }
    catch(error){
        console.log(error)
    }
} 

async function createTableAccounts(){
    try{
        var Tbody = document.querySelector("#t-body-all-accounts")
        var items = await handleGetAccounts()
        var table;

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