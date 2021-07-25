const {DataTypes} = require('sequelize')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('packages', {
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
        })
        await queryInterface.addIndex('packages', ['user', 'finished'])
        await queryInterface.addIndex('packages', ['institution', 'finished'])
        await queryInterface.addIndex('packages', ['institution'])
        await queryInterface.addIndex('packages', ['user'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('packages')
    }
}
