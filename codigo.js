module.exports = function() {
	var unique = require('uniq');

	data = [1, 2, 2, 3, 4, 5, 5, 5, 6];

	hola = "Hola";

	console.log(unique(data));
}

require('./codigo.js')()