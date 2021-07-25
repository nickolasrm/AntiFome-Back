const {Model, DataTypes} = require('sequelize')
const Donation = require('./donation')
const Package = require('./package')

class User extends Model
{
	static init(sequelize)
	{
		super.init({
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					allowNull: false,
					autoIncrement: true,
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
				},
				isCnpj: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
                state: {
                    type: DataTypes.CHAR(2),
                    allowNull: false
                },
				// Definitely not the right way to store it, but time is running out
                city: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                neighborhood: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                zip: {
                    type: DataTypes.CHAR(8),
                    allowNull: false
                },
				phone: {
					type: DataTypes.STRING(12),
					allowNull: false
				}
			}, 
			{
				sequelize,
				tableName: 'users',
				timestamps: false,
				indexes: [{fields: ['email']}, {fields: ['state', 'city', 'isCnpj']}]
			})
	}
}

module.exports = User
