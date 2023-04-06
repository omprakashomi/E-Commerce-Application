const express = require('express');
const routes = express.Router();
const {Category} = require('../models/category'); 
const {Product} = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  })
  
const uploadOptions = multer({ storage: storage })


routes.get('/', async (req, res) => {

    // filtering
    let filter = {};
    if(req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');
    if(!productList) { return res.status(404).json({success: false}); }
    res.send(productList);
})

routes.get('/:id', async (req, res) => {
    const productList = await Product.findById(req.params.id).populate('category');
    if(!productList) { return res.status(404).json({success: false}); }
    res.send(productList);
})



routes.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('No category found')

    const fileName = req.file.filename;
    const basepath = `${req.protocol}://${req.get('host')}/public/uploads`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basepath}${fileName}`,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReview: req.body.numReview,
        isfeatured: req.body.isfeatured,
        dateCreated: req.body.dateCreated,

    }) 
    product = await product.save();
    
    if (!product)
    return res.status(500).send('Product not saved')

    return res.send(product);
})


routes.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('No category found');

    const product = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReview: req.body.numReview,
    isfeatured: req.body.isfeatured,
    dateCreated: req.body.dateCreated,
    },
    {new: true, old: false}
    )
    if (!product) {
        return res.status(400).send({ message:"Product not updated"});
    }
    res.status(200).send(product);
})

routes.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, product) => {
        if(err) {
           return res.status(400).json({success: false, message: err});
        }
        if(product) {
            return res.status(200).json({success: true, message: product});
        }
    })
})

routes.get('/get/count', async (req, res) => {
    let productCount = await Product.countDocuments();

    if(!productCount) { 
        return res.status(500).json({success: false})
    }
    res.send({
        productCount: productCount
    });
})

routes.get('/get/featured/:count', async (req, res) => {
    let count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count);
    if(!products) { return res.status(404).json({success: false}); }
    res.send(products);
})

 module.exports = routes;