// Tabla con comentarios, sin relaciones. 
//  Su relación con Quiz se define en models.js
module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{
			texto: {
				type: DataTypes.STRING,
				validate: { notEmpty: { msg: '-> Falta Comentario' }}
			}
		}
	);
}