const Sequelize = require('sequelize')
const connection = require('../database/database')

const Upload = connection.define('upload', {
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Upload
