var express = require('express');
var bodyParser = require('body-parser');
var dao = require('./dao');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended:true}));
var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("server listening on http://localhost:" + port);
});

app.get('/', function(req, res) {
	res.render('index');
});
app.get('/busca', function(req, res) {
	var filtro = {};
	filtro.nome = req.param('b');
	filtro.minpx = parseFloat(req.param('minpx'));
	filtro.maxpx = parseFloat(req.param('maxpx'));


	
	console.log("buscando %s", filtro);
	dao.buscaProdutoComFiltro(filtro, function(e, rows) {
		if(e){
			console.error('erro carregando resultados do db', e);
			res.status(500);
			res.end('erro ao carregar dados');
		} else {
			rows = rows.map(function(el){
				el.preco = 'R$ ' + el.preco.toFixed(2);
				return el;
			})
			res.render('busca', {
				produtos: rows,
				filtro: filtro,

			});
		}
	});
});