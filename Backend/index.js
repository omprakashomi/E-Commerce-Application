const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./config/jwt");
const errorHandler = require('./config/error-handler');
const productRoutes = require('./api_routes/products');
const categoryRoutes = require('./api_routes/categories');
const userRoutes = require('./api_routes/users');
const orderRoutes = require('./api_routes/orders');


const app = express();

require("dotenv/config");
const api = process.env.API_URL;

// middleware
app.use(cors());
app.options('*', cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(authJwt());
app.use(errorHandler);

// Routes
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);




const url = `mongodb+srv://admin:admin@cluster0.mxjla.mongodb.net/My_Ecommerce?retryWrites=true&w=majority`;
mongoose.connect(url)
.then(()=> {
    console.log('database connection established');
})
.catch((err) => {
    console.log(err);
})
app.listen(3000, ()=> {
    console.log(api);
    console.log("Server is running on port 3000");
})