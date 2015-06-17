// MW de autorización: redirige a la página de login si el acceso 
//  no está autorizado. Si todo es correcto, cede el control al siguiente MW
exports.loginRequired  = function(req, res, next) {
	if ( req.session.user ) {
		next();
	}
	else {
		res.redirect('/login');
	}
} 

// GET /login
exports.new = function(req, res) {
	// Se salvaguardan los posibles errores producidos y se limpian
	var errors = req.session.errors || {};
	req.session.errors = {};

	// Se muestra la pantalla de login, con los errores más recientes, 
	//  de haberlos
	res.render('sessions/new', {
		errors: errors
	});
}

// POST /login
exports.create = function(req, res) {

	// Datos introducidos por el usuario en el login
	var login = req.body.login;
	var password = req.body.password;

	// La validación la hacemos a través de otro controlador
	//  y se maneja el resultado en un callback
	var userController = require('./user_controller');
	userController.autenticar(login, password, function (error, user) {
		if ( error ) {
			// En caso de error, se cubre para ser mostrado (ver más arriba en exports.new)
			req.session.errors = [
				{'message': 'Se ha producido un error: ' + error}
			];
			res.redirect('/login');
			return;
		}

		// Login exitoso: queda determinado por la existencia de esta 
		//  variable de sesión. Se mapean las propiedades individualmente
		//  para no propagar la contraseña, que está en user.password
		req.session.user = {
			id: user.id,
			username: user.username
		};
		// Se redirecciona a la página en la que se estaba antes de intentar 
		//  el login (ver Helper en app.js)
		res.redirect(req.session.redir.toString());
	});

}

// GET /logout
exports.destroy = function(req, res) {

	// Como se indica en exports.create, esta variable determina 
	//  la existencia de la sesión, que queda destruida con ella
	delete req.session.user;
	// Se redirecciona a la página en la que se estaba antes de hacer
	//  el logout (ver Helper en app.js)
	res.redirect(req.session.redir.toString());

}