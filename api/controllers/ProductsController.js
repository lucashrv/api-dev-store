const express = require('express')
const Category = require('../models/Categories')
const Product = require('../models/Products')

// Image upload
const multer = require('multer')
const path = require('path')
const uploadImage = require('../services/firebase')

// admin firebase
const admin = require("firebase-admin");

// Upload product image ( multer )

const Multer = multer({
    storage: multer.memoryStorage(),
    limits: 1024 * 1024,
    fileFilter: (req, file, callback) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return callback(null, true)
        }

        callback('Give proper files formate to upload - ' + fileTypes)
    },
})

//Product routes

const router = express.Router()

router.get('/api/products/getAll', async (req, res) => {
    try {

        const getAll = await Product.findAll({
            raw: true,
            order: [['name', 'ASC']],
            include: [{ model: Category }]
        })

        return res.status(200).json(getAll)

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })

    }
})

router.get('/api/products/getOne/:id', async (req, res) => {
    const { id } = req.params

    try {

        const getOne = await Product.findByPk(id)

        return res.status(200).json(getOne)

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })
    }
})

router.post('/api/products/create', Multer.single('image'), uploadImage, async (req, res) => {
    const {
        name,
        description,
        categoryId,
        amount,
        price
    } = req.body

    const { firebaseUrl } = req.file ? req.file : ''

    if (!name) {
        return res.status(404).json({
            msg: 'name is required!'
        })
    }
    if (!description) {
        return res.status(404).json({
            msg: 'description is required!'
        })
    }
    if (!categoryId || isNaN(categoryId)) {
        return res.status(404).json({
            msg: 'categoryId number format is required!'
        })
    }
    if (!amount || isNaN(amount)) {
        return res.status(404).json({
            msg: 'amount number format is required!'
        })
    }
    if (!price || isNaN(price)) {
        return res.status(404).json({
            msg: 'price number format is required!'
        })
    }

    const nameExists = await Product.findOne({ where: { name } })
    const idCategoryExists = await Category.findByPk(categoryId)

    if (nameExists) {
        return res.status(422).json({
            msg: 'name exists'
        })
    }
    if (!idCategoryExists) {
        return res.status(404).json({
            msg: 'categoryId not found in database'
        })
    }

    try {

        const create = await Product.create({
            name,
            description,
            categoryId,
            amount,
            price,
            image: firebaseUrl
        })

        return res.status(200).json({
            msg: 'Product created',
            data: create
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })

    }
})

router.patch('/api/products/update/:id', async (req, res) => {
    const { id } = req.params
    const {
        name,
        description,
        amount,
        categoryId,
        image,
        price
    } = req.body

    if (!id || isNaN(id)) {
        return res.status(422).json({
            msg: 'id number format is required'
        })
    }
    if (!name && !description && !amount && !categoryId && !image && !price) {
        return res.status(404).json({ msg: 'Not items for update' })
    }

    if (amount && isNaN(amount)) {
        return res.status(422).json({ msg: 'amount is not a number' })
    }
    if (categoryId && isNaN(categoryId)) {
        return res.status(422).json({ msg: 'categoryId is not a number' })
    }
    if (price && isNaN(price)) {
        return res.status(422).json({ msg: 'price is not a number' })
    }

    const categoryIdExists = await Category.findByPk(categoryId)
    const product = await Product.findByPk(id)

    if (categoryId && !categoryIdExists) {
        return res.status(422).json({
            msg: 'categoryId not found in database'
        })
    }

    if (!product) {
        return res.status(422).json({
            msg: 'product not found in database'
        })
    }

    try {

        const update = {}

        if (name) update.name = name
        if (description) update.description = description
        if (amount && !isNaN(amount)) update.amount = amount
        if (categoryId && !isNaN(amount)) update.categoryId = +categoryId
        if (image) update.image = image
        if (price) update.price = price

        await Product.update({ ...update }, { where: { id } })

        return res.status(200).json({ msg: `Product id ${id} updated` })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })
    }
})

router.delete('/api/products/destroy/:id', async (req, res) => {
    const { id } = req.params

    if (!id || isNaN(id)) {
        return res.status(422).json({
            msg: 'id number format is required!'
        })
    }

    const idExists = await Product.findByPk(id)

    if (!idExists) {
        return res.status(404).json({
            msg: 'Product not found in database'
        })
    }

    try {
        const fileUrl = idExists.image ? idExists.image : ''

        await Product.destroy({ where: { id } })

        await admin.storage().bucket().file("" + fileUrl.split('/')[4]).delete();

        return res.status(200).json({ msg: `Product id ${id} destroyed` })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ msg: 'Internal error' })

    }
})

module.exports = router
