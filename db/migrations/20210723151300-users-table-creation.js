const {DataTypes} = require('sequelize')

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
                }
            })
            //Adding index to improve performance
            await queryInterface.addIndex('users', ['email'])
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users')
    }
}