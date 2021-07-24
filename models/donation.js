const {Model, DataTypes} = require('sequelize')
const User = require('./user')

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
				allowNull: false
			},
            status: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0
            }
		}, {
			sequelize,
			timestamps: false,
			tableName: 'donations'
		})
	}

	static associate()
	{
		this.belongsTo(User, {foreignKey: 'id'})
	}
}

module.exports = Donation