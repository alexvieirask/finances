class RedirectTo{
    static Login(){
        window.location = "/"
    }
    
    static Home(){
        window.location = "/home"
    }
    
    static Account(){
        window.location = "/account"
    }
    
    static AccountDetails(){
        window.location = "/account/details"
    }
    
    static TransactionSimple(){
        window.location = "/transactionSimple"
    }
    
    static AccountsReceivable(){
        window.location = "/accounts_receivable"
    }
    
    static AccountsPayable(){
        window.location = "/accounts_payable"
    }
    
    static Rebate(){
        window.location = "/rebate"
    }
    
    static Settings(){
        window.location = "/settings"
    }
    
    static FormAccount(){
        window.location = "/new_account"
    }

}

export { RedirectTo }