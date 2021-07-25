const { Model, DataTypes } = require("sequelize")

class DeliveryContent extends Model
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
            content: {
                type: DataTypes.INTEGER,
                references: {model: 'contents', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false               
            }
		}, {
			sequelize,
			tableName: 'delivery_contents',
			indexes: [
				{fields: ['package', 'content']},
				{fields: ['package']}
			]
		})
	}
}

module.exports = DeliveryContent