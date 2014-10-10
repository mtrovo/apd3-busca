var request = require('request');
var cheerio = require('cheerio');
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('data/busca.db');

var urls = [
	'http://www.americanas.com.br/loja/227707/tv-e-home-theater',
	'http://www.americanas.com.br/loja/227644/eletrodomesticos',
	'http://www.americanas.com.br/loja/229187/celulares-e-telefones',
	'http://www.americanas.com.br/loja/228190/informatica'
]
db.serialize(function() {
	urls.forEach(function(url) {
		request.get(url, function(e, resp, body) {
			if(!e && resp.statusCode == 200){
				var $ = cheerio.load(body);
				var produtos = $('.single-product').get().map(function(el){
					var produto = {};
					var link = $('.productImg a', el).first();
					produto.$produto_url = link.attr('href');
					produto.$nome = link.attr('title');

					var img = $('.productImg a img', el).first();
					produto.$img_url = img.data('alternative-src');

					var price = $('.sale.price strong', el).first();

					var preco = price.text().trim();
					preco = preco.split(' ')[1]
						.replace(/\./g, '')
						.replace(/,/g, '.');
					produto.$preco = parseFloat(preco);
					console.log(produto);
					
					return produto;
				});

				db.serialize(function() {
					var insert = db.prepare('INSERT INTO produto VALUES($loja, $nome, $img_url, $produto_url, $preco)');
					produtos.forEach(function(produto) {
						insert.run(produto, function(err){
							if(!err) console.log("%s inserido com sucesso...", produto.$nome)
							else console.error(err);
						});
					});
					insert.finalize();
				});
			} else console.error("falha ao carregar dados", e);
		});
	});
});