class Loading{
    static show(){
        try{
            document.getElementById('loading').style.display = 'block';
        }
        catch(error){
            console.log(error)
        }
    }
    
    static hide(){
        try{
            document.getElementById('loading').style.display = 'none';
        }
        catch(error){
            console.log(error)
        }
    }
}

export { Loading }