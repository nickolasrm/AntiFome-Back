const {Model, DataTypes} = require('sequelize')
const User = require('./user')
const Content = require('./content')

class Package extends Model
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
            institution: {
                type: DataTypes.INTEGER,
                references: {model: 'users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            user: {
                type: DataTypes.INTEGER,
                references: {model: 'users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            finished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
		}, {
			sequelize,
			timestamps: false,
			tableName: 'packages',
            indexes: [{fields: ['user']}, {fields: ['institution']}, 
                {fields: ['user', 'finished']}, {fields: ['institution', 'finished']}]
		})
	}
}

module.exports = Package