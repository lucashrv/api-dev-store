require('dotenv').config();
const Sequelize = require('sequelize')

const connection = new Sequelize(
    process.env.POSTGRES_URL + process.env.SSL_MODE,
    {
        dialect: 'postgres',
        timezone: '-03:00',
        logging: false
    }
)

module.exports = connection
