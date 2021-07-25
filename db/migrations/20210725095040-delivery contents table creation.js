const { DataTypes } = require("sequelize")

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('delivery_contents', {
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
        })
        await queryInterface.addIndex('delivery_contents', ['package', 'content'])
        await queryInterface.addIndex('delivery_contents', ['package'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('delivery_contents')
    }
}
