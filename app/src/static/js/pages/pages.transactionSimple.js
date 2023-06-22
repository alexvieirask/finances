import *  as __global from "../utils/utils.global.js"

const { Session, Form } = __global;

document.addEventListener("DOMContentLoaded", function() {
    $("#form-transaction-simple").on("submit", handleAddNewTransactionSimple);
    $("#valor-transacao").on("input",Form.inputTypeNumber)
    
    handleLoadingSelectize();

    $("#natureza-lancamento").selectize();
    $("#categoria-lancamento").selectize();
});

function handleAddNewTransactionSimple(event) {
    event.preventDefault();
}

async function handleLoadingSelectize() {

   $("#conta-financeira").selectize({
        valueField: "id",
        labelField: "account_name",
        searchField: "account_name",
        create: false,
        options: [],
        preload: true,
        loadThrottle: 300,
        maxOptions: 5,
        load: function(query, callback) {
            fetch(`http://${Session.IP_ADDRESS}:5000/user/info/all_accounts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Session.JWT}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.details && data.details.length > 0) {
                        const filteredOptions = data.details.filter(item =>
                            item.account_name.toLowerCase().includes(query.toLowerCase())
                        );
                        callback(filteredOptions);
                    }
            });
        }
    });


    $("#categoria-lancamento").selectize({
        valueField:  "id",
        labelField:  "category_name",
        searchField: "category_name",
        create: false,
        options: [],
        preload: true,
        loadThrottle: 300,
        maxOptions: 5,
        load: function(query, callback) {
            fetch(`http://${Session.IP_ADDRESS}:5000/general_register/all_category`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Session.JWT}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.details && data.details.length > 0) {
                        const filteredOptions = data.details.filter(item =>
                            item.category_name.toLowerCase().includes(query.toLowerCase())
                        );
                        callback(filteredOptions);
                    }
            });
        }
    });
   
}