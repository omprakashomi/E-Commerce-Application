const {Category} = require('../models/category');
const express = require('express');
const routes = express.Router();


routes.get('/', async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(404).json({success: false});
    }
    res.status(200).send(categoryList);
})

routes.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({success: false, message: 'Category not found'});
    }
    res.status(200).send(category);
})

routes.post('/', async (req, res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();
    if(!category) {
    return res.status(500).send('Category not Created!');
    }
    res.status(200).send(category);
})

routes.put('/:id', async (req, res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    },
    {new: true, old: false}
    )
    if (!category) {
        return res.status(400).send({message:"Category not updated"});
    }
    res.status(200).send(category);
})

routes.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err, category) => {
        if(err) {
           return res.status(400).json({success: false, message: err});
        }
        if(category) {
            return res.status(200).json({success: true, message: category});
        }
    })
})

module.exports = routes;