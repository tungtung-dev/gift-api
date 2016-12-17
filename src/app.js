import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import morgan from "morgan";
import config from "./config";
import userRoute from './routes/user/index';
import adminRoute from './routes/admin/index';

var app = express();
// mongoose.connect(config.database);
mongoose.connect(config.database, config.dbOptions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
    if (app.get('env') === 'development') {
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
        // TODO Allowed domain needs to be updated corresponding with your site
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Cache-Control, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// User routes
app.use('/', userRoute.commonRoute);
app.use('/users', userRoute.userRoute);
app.use('/categories', userRoute.categoryRoute);
app.use('/products', userRoute.productRoute);
app.use('/orders', userRoute.orderRoute);
app.use('/cards', userRoute.cardRoute);
app.use('/auth', userRoute.authRoute);

// Admin routes
app.use('/admin', adminRoute.commonRoute);
app.use('/admin/users', adminRoute.userRoute);
app.use('/admin/categories', adminRoute.categoryRoute);
app.use('/admin/products', adminRoute.productRoute);
app.use('/admin/orders', adminRoute.orderRoute);
app.use('/admin/cards', adminRoute.cardRoute);
app.use('/admin/setup', adminRoute.setupRoute);

app.listen(config.port, () => {
    console.log(`App listening ${config.port}!!`);
});