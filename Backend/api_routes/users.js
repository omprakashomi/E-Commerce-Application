const express = require('express');
const routes = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


routes.get('/', async (req, res) => {
    const userList = await User.find().select('-password');
    if (!userList) {
        res.status(404).json({success: false});
    }
    res.status(200).send(userList);
})


routes.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404).json({success: false, message: 'Category not found'});
    }
    res.status(200).send(user);
})


routes.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return res.status(400).send('User not found');
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let payload = {email: user.email, isAdmin: user.isAdmin};
         const sec = process.env.secret;
        const token = jwt.sign(payload, sec, { expiresIn: '1d'});
       return res.status(200).send({user: user.email, token: token});
    } else {
        return res.status(400).send('Invalid password');
    }
    // return res.sta tus(200).send(user);
})

routes.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 2),
        phone: req.body.phone,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();
    if(!user) {
    return res.status(500).send('User not Created!');
    }
    res.status(200).send(user);
})



routes.post('/', async (req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 2),
        phone: req.body.phone,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();
    if(!user) {
    return res.status(500).send('User not Created!');
    }
    res.status(200).send(user);
})

routes.put('/:id', async (req, res)=>{
    const userExists = await User.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 2);
    }else {
        newPassword = userExists.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        // password: bcrypt.hashSync(req.body.password, 2),
        phone: req.body.phone,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    },
    {new: true, old: false}
    )
    if (!user) {
        return res.status(400).send({message:"Category not updated"});
    }
    res.status(200).send(user);
})

routes.get('/get/count', async (req, res) => {
    let userCount = await User.countDocuments();

    if(!userCount) { 
        return res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    });
})

module.exports = routes;