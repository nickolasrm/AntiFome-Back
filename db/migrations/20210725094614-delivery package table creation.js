const {DataTypes} = require('sequelize')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('delivery_packages', {
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
        })
        await queryInterface.addIndex('delivery_packages', ['user', 'finished'])
        await queryInterface.addIndex('delivery_packages', ['package', 'finished'])
        await queryInterface.addIndex('delivery_packages', ['package'])
        await queryInterface.addIndex('delivery_packages', ['user'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('delivery_packages')
    }
}
