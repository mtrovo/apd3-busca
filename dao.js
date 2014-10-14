var sqlite = require('sqlite3').verbose();

var db = new sqlite.Database('data/busca.db');

var ProdutoDao = new Object();
ProdutoDao.buscaProdutoComFiltro = function(filtro, callback){
	var query = "SELECT * FROM produto " + 
				"WHERE LOWER(nome) like ? AND preco <= ? AND preco >= ? " +
				"ORDER BY preco";

	var stmt = db.prepare(query);
	var search = '%'+filtro.nome.toLowerCase()+'%';
	var min = filtro.minpx || 0;
	var max = filtro.maxpx || 999999;
	var args = [search, max, min];

	console.log('executando query: %s com params %s', query, args);
	stmt.all(args, callback);
};


module.exports = ProdutoDao;
