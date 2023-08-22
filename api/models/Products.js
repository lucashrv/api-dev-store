const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('./Categories')

const Product = connection.define('products', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
})

Category.hasMany(Product)
Product.belongsTo(Category)

module.exports = Product
