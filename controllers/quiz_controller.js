var models = require('../models/models.js');

// AUTOLOAD de quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function (quiz) {
		if ( quiz ) {
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error('No existe el quizId' + quizId));
		}
	}).catch(function (error) {
		next(error);
	});
}

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', {
			quizes: quizes
		});
	});
}

// GET /quizes/:quizId
exports.show = function(req, res) {
	res.render('quizes/show', {
		quiz: req.quiz
	});		
}

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: (
			req.query.respuesta === req.quiz.respuesta ?
			'Correcto' : 'Incorrecto'
		)
	});		
}