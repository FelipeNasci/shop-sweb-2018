

function cart(){
	
	var quant = parseInt(document.formCarrinho.cCarrinho.value);
	document.formCarrinho.cCarrinho.value = quant + 1;
}

function limpa(conteudo){
	
	switch(conteudo){
		case "Login":
			document.formLogin.cLogin.value = "";
			break;
		case "Senha":
			document.formLogin.cSenha.value = "";
			break;
		case "Pesquisa":
			document.formLogin.cPesquisa.value = "";
			break;
			
	}
	
}