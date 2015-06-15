var models = require('../models/models.js');

// AUTOLOAD de quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function (quiz) {
		if ( quiz ) {
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error('No existe el quizId ' + quizId));
		}
	}).catch(function (error) {
		next(error);
	});
}

// GET /quizes
exports.index = function(req, res) {
	
	// Solo si se proporciona condición de búsqueda, la procesamos 
	//  y ordenamos alfabéticamente
	var filter = {};
	if ( req.query.search ) {
		var search = '%' + req.query.search.replace(/\s/g, '%')  + '%'
		filter = {
			where: ["pregunta like ?", search],
			order: 'pregunta'
		};
	}

	// Adicionalmente, entregamos a la vista el filtro realizado, 
	//  para poder mostrarlo en pantalla, de haberlo (ver views/quizes/index.ejs)
	models.Quiz.findAll(filter).then(function(quizes) {
		res.render('quizes/index', {
			quizes: quizes,
			search: req.query.search,
			errors: []
		});
	});
}

// GET /quizes/:quizId
exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz: req.quiz,
		errors: []
	});		
}

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: (
			req.query.respuesta === req.quiz.respuesta ?
			'Correcto' : 'Incorrecto'
		),
		errors: []
	});		
}

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({
		pregunta: 'Pregunta',
		respuesta: 'Respuesta'
	});
	res.render('quizes/new', {
		quiz: quiz,
		errors: []
	});
}

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function (err) {
		if ( err ) {
			res.render('quizes/new', {
				quiz: quiz,
				errors: err.errors
			});
		}
		else {
			quiz.save({
				fields: ['pregunta', 'respuesta']
			}).then(function () {
				res.redirect('/quizes');
			});
		}
	});

}