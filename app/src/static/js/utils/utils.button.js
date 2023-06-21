class Button{
    static onClick(id_button, action){
        document.querySelector(id_button).addEventListener("click", action);
    }
}

export { Button }