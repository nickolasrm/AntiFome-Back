const {DataTypes, INTEGER} = require('sequelize')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('donations', {
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
            priority: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            finished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        })
        await queryInterface.addIndex('donations', ['finished', 'user'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('donations')
    }
}
