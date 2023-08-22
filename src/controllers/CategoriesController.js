const express = require('express')
const Category = require('../models/Categories')
const Product = require('../models/Products')

const router = express.Router()

router.get('/api/categories/getAll', async (req, res) => {
    try {

        const categories = await Category.findAll({
            order: [ ['name', 'ASC'] ],
            raw: true
        })

        res.status(200).json(categories)

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })

    }
})

router.get('/api/categories/:id', async (req, res) => {
    const { id } = req.params

    if(!id || isNaN(id)) {
        return res.status(404).json({
            msg: 'id number format is required!'
        })
    }

    try {

        const getOne = await Category.findByPk(id)

        res.status(200).json(getOne)

    } catch (error) {

        console.log(error)

        res.status(500).json({ msg: 'Internal error' })
    }
})

router.post('/api/categories/create', async (req, res) => {
    const { name } = req.body

    const nameExists = await Category.findOne({ where: { name } })

    if(!name) return res.status(404).json({ msg: 'name is required!' })
    if(nameExists) return res.status(422).json({ msg: 'Category name exists' })

    try {

        const create = await Category.create({ name })

        return res.status(200).json({
            msg: 'Category created',
            data: create
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })

    }
})

router.put('/api/categories/update/:id', async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if(!id || isNaN(id)) {
        return res.status(404).json({
            msg: 'id number format is required!'
        })
    }
    if(!name) return res.status(404).json({ msg: 'name is required!' })

    const idExists = await Category.findByPk(id)
    const nameExists = await Category.findOne({ where: { name }})

    if(!idExists) {
        return res.status(422).json({ msg: 'Category id not exists' })
    }
    if(nameExists) {
        return res.status(422).json({ msg: 'Category name exists' })
    }

    try {

        await Category.update(
            { id, name },
            { where: { id } }
        )

        return res.status(200).json({  msg: `Category id ${id} updated` })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })
    }
})

router.delete('/api/categories/destroy/:id', async (req, res) => {
    const { id } = req.params

    if(!id || isNaN(id)) {
        return res.status(404).json({
            msg: 'id number format is required!'
        })
    }

    const idExists = await Category.findOne({ where: { id } })
    const productInCategory = await Product.findOne({ where: { categoryId: id } })

    if(!idExists) return res.status(422).json({ msg: 'Id not found in database' })
    if(productInCategory) return res.status(422).json({
        msg: 'Products registered in this category'
    })

    try {

        await Category.destroy({ where: { id } })

        return res.status(200).json({ msg: `Category id ${id} destroyed` })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })

    }
})

module.exports = router
