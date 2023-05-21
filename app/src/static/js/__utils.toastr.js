const CONFIG = {
    closeButton: true,
    preventDuplicates: true
}

function show(type,message){
    toastr.options = CONFIG
    
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


export { show }