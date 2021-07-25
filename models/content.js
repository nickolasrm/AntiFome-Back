const {Model, DataTypes} = require('sequelize')
const Package = require('./package')
const Donation = require('./donation')

/**
 * Contains all entries of a package table
 */
class Content extends Model
{
	static init(sequelize)
	{
		super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            package: {
                type: DataTypes.INTEGER,
                references: {model: 'packages', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            donation: {
                type: DataTypes.INTEGER,
                references: {model: 'donations', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
		}, {
			sequelize,
			timestamps: false,
			tableName: 'contents',
            indexes: [{fields: ['package']}]
		})
        return Content
	}
}

module.exports = Content