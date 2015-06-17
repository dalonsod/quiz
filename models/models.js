var path = require('path');

// Crea base de datos
// - SQLite en local  (sqlite://:@:/)
// - Postgres en producción (postgres://user:pass@host:port/database)
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Clase generadora de ORM
var Sequelize = require('sequelize');

var sequelize = new Sequelize(
	DB_name,
	user,
	pwd,
	{
		dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage
	}
);

// Importación: sequelize recoge la definición de las tablas desde el modelo
// - Tabla de preguntas
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// - Tabla de respuestas, con relación 1-N con las preguntas
var Comment = sequelize.import(path.join(__dirname, 'comment'));
Comment.belongsTo(Quiz);   // Esto añade un campo 'QuizId' en la tabla de comentarios (ver comment_controller.js => exports.create)
Quiz.hasMany(Comment);

// Exportación: la hacemos disponible desde este módulo
exports.Quiz = Quiz;
exports.Comment = Comment;

// Por último, realizamos la inicialización, que crea las tablas 
//  e inicializa la de preguntas
sequelize.sync().then(function () {
	// Solo la inicializamos si está vacía
	Quiz.count().then(function (count) {
		if ( count === 0 ) {
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'geografia'				
			});
			Quiz.create({
				pregunta: 'Autor de "El Quijote"',
				respuesta: 'Cervantes',
				tema: 'humanidades'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'geografia'
			}).then(function () {
				console.log('Base de datos inicializada');
			});
		}
	});
});