class Toastr{
    static show(type,message){
        if (type === 'success'){
            toastr.success(message)
        }
        if ( type === 'error'){
            toastr.error(message)
        }
        if ( type === 'warning'){
            toastr.warning(message)
        }
    }
}

export { Toastr }