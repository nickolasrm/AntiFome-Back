module.exports = {
	dialect: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	username: process.env.DB_USER || 'admin',
	password: process.env.DB_PASSWORD || 'admin',
	database: process.env.DB_DATABASE || 'antifome-dev'
}