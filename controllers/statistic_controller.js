var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res) {
	
	// Es factible buscar todas las preguntas con sus comentarios 
	//  y obtener los todos valores a partir de ahí
	// Así no encadenamos callbacks para hacer las sucesivas consultas
	models.Quiz.findAll({
		include: [{ model: models.Comment }]
	}).then(function(quizes) {
		
		var quizCount = quizes.length;
		var commentCount = 0;
		var quizesWithComments = 0;
		var quizesWithoutComments = 0;

		for ( var index in quizes ) {
			var quizCommentCount = quizes[index].Comments.length;
			commentCount += quizCommentCount;
			if ( quizCommentCount > 0 ) {
				quizesWithComments++;
			}
			else {
				quizesWithoutComments++;
			}
		}

		res.render('statistics/show', {
			quizCount: quizCount,
			quizAvgComments: (
				quizCount ?
				(commentCount / quizCount).toPrecision(2).replace('.', ',') :
				'-'
			),
			commentCount: commentCount,
			quizesWithComments: quizesWithComments,
			quizesWithoutComments: quizesWithoutComments,
			errors: []
		});

	});

}