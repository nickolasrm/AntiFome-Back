const {Model, DataTypes} = require('sequelize')
const User = require('./user')
const Content = require('./content')

class Donation extends Model
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
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
			user: {
				type: DataTypes.INTEGER,
				allowNull: false,
                references: {model: 'users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
			},
            donationFinished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
		}, {
			sequelize,
			timestamps: false,
			tableName: 'donations',
			indexes: [{fields: ['donationFinished', 'user']}]
		})
	}
}

module.exports = Donation