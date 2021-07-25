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
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
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
        return Donation
	}

    static associate(models)
    {
        Donation.hasMany(models.Content, {foreignKey: 'id', sourceKey: 'donation'})
    }
}


module.exports = Donation