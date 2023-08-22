const Sequelize = require('sequelize')
const connection = require('../api/database/database')

const Category = connection.define('categories', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Category
