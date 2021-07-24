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
	SALT_ROUNDS: 10,
	DONATION_MAX_PRIORITY: 3,
	DONATION_MIN_PRIORITY: 0,
	/** Waiting donator */
	WAITING_DONATOR: 0,
	/** Waiting transport */
	WAITING_TRANSPORT: 1,
	/** Waiting to be delivered */
	GOING: 2,
	/** Package delivered */
	DELIVERED: 3
}