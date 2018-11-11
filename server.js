
var express = require('express');


var app = express();	//variavel do Servidor

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));

var urlencodedParser = bodyParser.urlencoded( {extended: false} );

var handlebars = require('express-handlebars');
app.engine("handlebars", handlebars( {defaultLayout: 'main'} ));
app.set('view engine','handlebars');

// Iniciando Servidor node
var porta = 3001;
app.listen( porta, function(req, res) {

	console.log('Servidor ativo na porta ' + porta);

} );

// --- conexao com o banco de dados

var mysql = require('mysql');
var connection = mysql.createConnection( {

	host	: 'localhost',
	user 	: 'adm',
	password: 'user',
	database: 'loja'

} );

connection.connect( function(err){

	if(err){
		console.error('Falha na conexao' + err.stack);
		return;
	}

	console.log("Banco de dados conectado");

} );
// -- Fim Conexao com o banco


// rotas do site
app.get('/', function(req, res){

	//{layout: 'layoutRoot'} sobreescreve o template padrao
	res.render('root', {layout: 'layoutRoot'});

});


app.get('/cadastroProduto', function (req, res) {

	//requisitando nome o nome das categorias
	console.log('requisita nome de categorias');

	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log('Acessando categorias do Banco');

		if(error) throw error;

		console.log("Resultados da requisicao");
		console.log(resultado)

		res.render ( 'cadastroProduto', {
			title: "Categorias do banco",
			resultado: resultado

		} );

	});


	//retorna a pagina
    //res.render('cadastroProduto');

    
});

app.post('/produtoCadastrado', function(req, res){

	var nome = req.body.nomeProduto;
	var valor = req.body.valorProduto;
	var catid = req.body.catid;


	var sqlQue = "insert into produtos (nome, catid, valor) values ('" + nome+ "','"+ catid  + "','" + valor + "');"

	//console.log('Nome: ' + nome + ' Valor: ' + valor + ' Categoria: ' + catid);
	

	connection.query(sqlQue, function(error, resultado, campos) {

		console.log(sqlQue);

		if(error) throw error;

		console.log('Produto salvo');
	});






	res.render('root', {layout: 'layoutRoot'});

});


/*
app.get( '/', function(req, res){

	console.log('Acessaram a home page');

	var sqlQuery = 'select * from categorias';
	

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log('Acessando o BD');

		if(error) throw error;

		console.log("Resultados da requisicao");
		console.log(resultado)

		res.render ( 'home', {
			title: "Exemplo de banco de dados - esta trabalhando?",
			resultado: resultado

		} );

	});

} );
*/
