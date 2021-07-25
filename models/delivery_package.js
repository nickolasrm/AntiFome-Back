const { Model, DataTypes } = require("sequelize")

class DeliveryPackage extends Model
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
			tableName: 'delivery_packages',
			indexes: [
				{fields: ['user', 'finished']},
				{fields: ['user', 'package']},
				{fields: ['user']},
				{fields: ['package']}
			]
		})
	}
}

module.exports = DeliveryPackage