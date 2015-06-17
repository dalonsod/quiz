var models = require('../models/models.js');

// GET /quizes/:quizId/comment/new
exports.new = function(req, res) {
	res.render('comments/new', {
		quizId: req.params.quizId,
		errors: []
	});
}

// POST /quizes/:quizId/comment
exports.create = function(req, res) {
	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		// La clave foránea se denomina así por venir del modelo 'Quiz'
		QuizId: req.params.quizId
	});

	comment.validate().then(function (err) {
		if ( err ) {
			// Se vuelve a la pantalla de creación, con la información 
			//  introducida y el error producido
			res.render('comments/new', { 
				comment: comment, 
				quizId: req.params.quizId,
				errors: err.errors
			});
		}
		else {
			comment.save().then(function () {
				// Al grabar con éxito, volvemos a la pregunta 
				//  donde se insertó este comentario
				res.redirect('/quizes/' + req.params.quizId);
			});
		}
	})
}