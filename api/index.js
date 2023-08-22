const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connection = require('./database/database')

// const ProductController = require('./controllers/)ProductsController'
// const CategoryController = require('./controllers/)CategoriesController'

const port = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded(
    { extended: false }
))
app.use(express.json())

app.use(cors())

//Static images folder
app.use(express.static('public'))


//DB connection
// connection
//     .authenticate()
//     .then(() => console.log('Connected to DB'))
//     .catch(e => console.log(e))

//Routes

// app.use('/', ProductController)
// app.use('/', CategoryController)

app.get('/', (req, res) => {
    res.json({ msg: "asdsadsadsa" })
})

app.listen(port, () => console.log(`Server start`))

