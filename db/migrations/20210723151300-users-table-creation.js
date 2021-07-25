const { DataTypes } = require('sequelize')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                // Will be used as the login username
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                //60 because of bcrypt
                password: {
                    type: DataTypes.CHAR(60),
                    allowNull: false
                },
                cpfCnpj: {
                    type: DataTypes.STRING(14),
                    allowNull: false
                },
                isCnpj: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                state: {
                    type: DataTypes.CHAR(2),
                    allowNull: false
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                neighborhood: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                zip: {
                    type: DataTypes.CHAR(8),
                    allowNull: false
                },
                phone: {
                    type: DataTypes.STRING(11),
                    allowNull: false
                }
            })
        //Adding index to improve performance
        await queryInterface.addIndex('users', ['email'])
        await queryInterface.addIndex('users', ['state', 'city', 'isCnpj'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users')
    }
}