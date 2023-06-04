class Loading{
    static show(){
        document.getElementById('loading').style.display = 'block';
    }
    
    static hide(){
        document.getElementById('loading').style.display = 'none';
    }
}

export { Loading }