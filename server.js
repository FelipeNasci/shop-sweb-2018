
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
		redisClient: redisClient,
		ttl: 260 }),
	saveUniitialized: false,
	resave: false

}));

/*
var session = require('express-session'), RedisStore = require('connect-redis') (session);
app.use(session({

	store: new RedisStore({ 'host': config.redisHost, 'port':6379  }),
	secret: 'qA5JrwUCTZuqTAEPEZMhaMWq',
	resave: false,
	saveUniitialized: false,
	cookie: {maxAge: 6000} //Tempo que uma sessao fica ativa -> 60s

}));
*/
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

//Pagina incial
function home(req, res){

	//console.log('requisita nome de categorias');

	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		//console.log('Acessando categorias do Banco');

		if(error) throw error;

		//console.log("Resultados da requisicao");
		//onsole.log(resultado)

		res.render ( 'home', {

			//layout: 'layoutRoot',
			resultado: resultado

		} );

	});

	//{layout: 'layoutRoot'} sobreescreve o template padrao
	//res.render('root', );

}

function root (login, req, res){


	var sqlQuery = 'select * from categorias';

	connection.query(sqlQuery, function(error, resultado, campos) {

		//console.log('Acessando categorias do Banco');

		if(error) throw error;

		//console.log("Resultados da requisicao");
		//console.log(resultado)

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
	console.log('Cookies: ', req.sessionid);
	console.log('Session Key: ', req.session.key);

});


app.post('/pgLogin', function(req, res){

	var login = req.body.login;
	var senha = req.body.senha;


	var sqlQuery = "select login, senha from usuario where login = '" + login + "' and senha = '" + senha + "';";

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		if(resultado == ''){

			console.log('LOGIN INVALIDO' + resultado);
			home(req, res);

		}else if (login == 'root' && senha == 'root'){

			root(login, req, res);

		}else{

			res.send('usuario logado');

		}


		console.log(resultado);

	});

	

});

app.get('/cadastro', function(req, res){

	res.render('cadastro');


});

app.post('/cadastro', function(req, res){
	
	var login = req.body.login;
	var senha = req.body.senha;

	console.log('login = ' + login);
	console.log('senha = ' +senha);

	var sqlQuery = "insert into usuario (login, senha) values ('" + login + "','" + senha  + "');";
	
	console.log('solicita cadastro de usuario');

	connection.query(sqlQuery, function(error, resultado, campos) {

		console.log(sqlQuery);

		if(error) throw error;

		console.log('Cadastro realizado');
	});

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

		res.res ( 'cadastroProduto', {
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
