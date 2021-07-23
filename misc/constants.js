const path = require('path')

const BASE_PATH = path.dirname(__dirname)

module.exports = {
	/** Main app folder */
	APP_PATH: BASE_PATH,
	/** Folder containing public static files */
	PUBLIC_PATH: path.join(BASE_PATH, 'public'),
	/** Folder containing private views for rendering */
	VIEWS_PATH: path.join(BASE_PATH, 'views'),
	/** Number of bcrypt salts */
	SALT_ROUNDS: 10
}