
var express = require('express');

var app = express();	//variavel do Servidor

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));

var urlencodedParser = bodyParser.urlencoded( {extended: false} );

var cookieParser = require('cookie-parser');
app.use(cookieParser());


var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redisClient = redis.createClient();

app.use(session({

	secret: 'ssshhhh',
	//create new redis store
	store: new redisStore({ 
		host: 'localhost', 
		port: 6379,
		client: redisClient,
		}),
	saveUninitialized: false,
	resave: false

}));

app.use(express.static('public'));

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

/*
	host	: 'localhost',
	user 	: 'root',
	password: 'K@llyl310793',
	database: 'shop-sweb'
*/	
	host	: 'localhost',
	user 	: 'adm',
	password: 'pass',
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



//******	USUARIOS NAO CADASTRADOS 	******

//Pagina incial para qualquer usuario
function home(req, res){

	//console.log('requisita nome de categorias');

	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log('Acessando categorias do Banco');

		if(error) throw error;

		//enviar a pg inciial
		res.render ( 'home', {
			resultado: resultado
		} );

	});

}

//Caso o usuario seja o administrador
function root (login, req, res){

	//Menu de categorias
	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		if(error) throw error;

		res.render ( 'root', {

			layout: 'layoutRoot',
			login: login,
			resultado: resultado

		} );

	});

}

// rotas do site

app.get('/', function(req, res){

	home(req, res);

});

//Realiza login
app.post('/pgLogin', function(req, res){

	var login = req.body.login;
	var senha = req.body.senha;

	//Verifica se login e senha sao compativeis
	var sqlQuery = "SELECT * from usuario WHERE login = '" + login + "' AND senha = '" + senha + "' ;";

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		if(resultado == ''){

			console.log('LOGIN INVALIDO');
			home(req, res);

		}else if (resultado[0].nivel_acesso == 1){

			req.session.key = req.sessionID;
			console.log('key do root = ' + req.session.key);
			root(login, req, res);

		}else{

			console.log('entrou no else');

			req.session.key = req.sessionID;
			res.send('Usuário logado');

		}
	});
});

//Pagina de Cadastro
app.get('/cadastro', function(req, res){

	//Envia para a pagina de cadastro
	res.render('cadastro');
});

//Cadastra novo usuario
app.post('/cadastro', function(req, res){
	
	var login = req.body.login;
	var senha = req.body.senha;

	console.log('login = ' + login);
	console.log('senha = ' + senha);

	//Cadastra novo login, senha e nivel de usuario
	var sqlQuery = "insert into usuario (login, senha, nivel_acesso) values ('" + login + "','" + senha  + "', '0');";
	
	console.log('solicita cadastro de usuario');

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		console.log('Cadastro realizado');
	});

	home(req, res);

});


// *******	ADMINISTRADOR 	*******


//Quando o root clickar em CADASTRAR PRODUTO

app.get('/cadastroProduto', function (req, res) {

	//requisitando nome o nome das categorias
	console.log('requisita nome de categorias');

	//Solicita todas as categorias do banco de dados
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
	var urlImage = '../public/imagens/' + nome;

	//Insere novo produto no banco de dados
	var sqlQuery = "insert into produtos (nome, catid, valor) values ('" + nome + "','"+ catid  + "','" + valor + "');"

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		console.log('Produto salvo');
		
	});
	
	//Volta para a pagina principal do administrador
	root('root', req, res);

	console.log('encaminha para root');

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

	root('root', req, res);
});