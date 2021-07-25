const { DataTypes } = require("sequelize")

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('contents', {
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
                allowNull: false               
            }
        })
        await queryInterface.addIndex('contents', ['package'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('contents')
    }
}
