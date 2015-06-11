var path = require('path');

// Clase generadora de ORM
var Sequelize = require('sequelize');

// Crea base de datos SQLite 'quiz.sqlite'
var sequelize = new Sequelize(
	null,
	null,
	null,
	{
		dialect: 'sqlite',
		storage: 'quiz.sqlite'
	}
);

// Importación: sequelize recoge la definición de la tabla de preguntas 
//              desde el modelo
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportación: la hacemos disponible desde este módulo
exports.Quiz = Quiz;

// Por último, realizamos la inicialización, que crea la tabla y la inicializa
sequelize.sync().success(function () {
	// Solo la inicializamos si está vacía
	Quiz.count().success(function (count) {
		if ( count === 0 ) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			}).success(function () {
				console.log('Base de datos inicializada');
			});
		}
	});
});