const Sequelize = require('sequelize')
const connection = require('../api/database/database')

const Upload = connection.define('upload', {
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Upload
