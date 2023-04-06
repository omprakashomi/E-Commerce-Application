const express = require('express');
const routes = express.Router();
const {Order} = require('../models/order');
const {OrderItem} = require('../models/order-item');

routes.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false});
    }
    res.send(orderList);
})

routes.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

routes.post('/', async (req, res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map( async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdResolved = await orderItemsIds;

    let order = new Order({
        orderItems: orderItemsIdResolved,
        shippingAddress1: req.body.shippingAddress1, 
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered,
    })
    order = await order.save();
    if(!order) {
    return res.status(500).send('Order failed!');
    }
    res.status(200).send(order);
})

routes.put('/:id', async (req, res)=>{
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    },
    {new: true, old: false}
    )
    if (!order) {
        return res.status(400).send({message:"Order not updated"});
    }
    res.status(200).send(order);
})

routes.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id, (err, order) => {
        if(err) {
           return res.status(400).json({success: false, message: err});
        }
        if(order) {
            return res.status(200).json({success: true, message: order});
        }
    })
})

module.exports = routes;