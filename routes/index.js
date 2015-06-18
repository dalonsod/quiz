var express = require('express');
var router = express.Router();

// Controladores existentes
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticController = require('../controllers/statistic_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
  	title: 'Quiz',
	errors: [] 
  });
});

// Autoload de parámetro quizId
router.param('quizId', 	  quizController.load);
router.param('commentId', commentController.load);

// Rutas de gestión de la sesión
router.get('/login',	sessionController.new);
router.post('/login',	sessionController.create);
router.get('/logout',	sessionController.destroy);   // Debería ser DELETE /login

// Rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', 						commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    						commentController.create);
// Debería ser PUT /...
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
	sessionController.loginRequired, commentController.publish
);

router.get('/quizes/statistics', statisticController.show);

// Página de créditos: dado que es sencillo, 
//  se opta por no hacer un controlador específico
router.get('/author', function(req, res) {
  res.render('author', { 
	errors: []
  });
});

module.exports = router;
