type T_New_User = {
    fullname            : string
    username            : string
    useremail           : string
    userpassword        : string
    userrepeatpassword  : string
}

type T_Login = {
    useremail    : string
    userpassword : string
}

type T_Change_Password = {
    useremail                 : string
    userresetpasswordtoken    : string
    usernewpassword           : string
    usernewpasswordrepeat     : string
}

type T_Info_User = {
    email: string
    fullname: string
    id : number
    password_hash : string
    register_date : Date
    username: string
}


export { T_New_User, T_Change_Password, T_Login, T_Info_User }