var models = require('../models/models.js');

// Autoload del id. del comentario
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: { id: Number(commentId) }
	}).then(function(comment) {
		if ( comment ) {
			req.comment = comment;
			next();
		}
		else {
			next(new Error('No existe el commentId=' + commentId));
		}
	}).catch(function(error) {
		next(error);
	})
}

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

// GET /quizes/:quizId/comment/:commentId/pubish
exports.publish = function (req, res) {
	// Gracias al autoload nos llega el comentario, al que añadimos 
	//  la marca de publicado
	req.comment.publicado = true;

	req.comment.save({
		fields: ['publicado']
	}).then(function() { 
		// También valdría req.comment.QuizId
		res.redirect('/quizes/' + req.params.quizId); 
	}).catch(function(error) {
		next(error);
	});
}