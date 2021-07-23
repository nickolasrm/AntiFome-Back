const {Model, DataTypes} = require('sequelize')

class User extends Model
{
	static init(sequelize)
	{
		super.init({
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					allowNull: false,
					autoIncrement: true
				},
				username: {
					type: DataTypes.STRING,
					allowNull: false
				},
				// Will be used as the login username
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true
				},
				// Password is stored in CHAR(60) because of bcrypt
				password: {
					type: DataTypes.CHAR(60),
					allowNull: false
				},
				cpfCnpj: {
					type: DataTypes.STRING(14),
					allowNull: false
				}
			}, 
			{
				sequelize,
				tableName: 'users',
				timestamps: false
			})
	}
}

module.exports = User