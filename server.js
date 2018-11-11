
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

//*****************************************************
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
//*****************************************************

//Pagina incial
function home(req, res){

	console.log('requisita nome de categorias');

	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log('Acessando categorias do Banco');

		if(error) throw error;

		console.log("Resultados da requisicao");
		console.log(resultado)

		res.render ( 'root', {

			layout: 'layoutRoot',
			resultado: resultado

		} );

	});

	//{layout: 'layoutRoot'} sobreescreve o template padrao
	//res.render('root', );

}

// rotas do site

app.get('/', function(req, res){

	home(req, res);

});

//Quando o root clickar em CADASTRAR PRODUTO

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
			resultado: resultado
		} );

	});

});

//Resposta com os dados dos produtos a serem cadastrados

app.post('/produtoCadastrado', function(req, res){

	var nome = req.body.nomeProduto;
	var valor = req.body.valorProduto;
	var catid = req.body.catid;


	var sqlQuery = "insert into produtos (nome, catid, valor) values ('" + nome + "','"+ catid  + "','" + valor + "');"

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		console.log('Produto salvo');
	});

	home(req, res);

});

//Quando o usuario clicar em CADASTRAR CATEGORIA

app.get('/cadastraCategoria', function (req, res) {

	//requisitando nome o nome das categorias
	console.log('requisita nome de categorias');

	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log('Acessando categorias do Banco');

		if(error) throw error;

		console.log("Resultados da requisicao");
		console.log(resultado)

		res.render ( 'cadastraCategoria', {
			resultado: resultado

		} );

	});

});

app.post('/categoriaCadastrada', function(req, res){

	var nome = req.body.nomeCategoria;

	var sqlQuery = "insert into categorias (nome) values ('" + nome + "');";

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		console.log('Produto salvo');
	});

	home(req, res);
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
