function show() {
    document.getElementById('loading-icon').style.display = 'block';
  }
  
  // Adicione essa função ao seu código JavaScript para ocultar o ícone de carregamento
  function hide() {
    document.getElementById('loading-icon').style.display = 'none';
}

export { show, hide}