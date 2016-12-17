/**
 * Created by Tien Nguyen on 11/23/16.
 */
import express from "express";
import {createSuperAdmin} from "../../dao/userDao";
import {showResultToClient} from "../../utils/responseUtils";
import {initCategories} from "../../dao/categoryDao";
import {initProducts} from "../../dao/productDao";

var router = express.Router();

router.get('/init-categories', (req, res) => {
    initCategories((err, data)=> {
       showResultToClient(err, data, res);
    });
});

router.get('/init-products', (req, res) => {
    initProducts((err, data)=> {
       showResultToClient(err, data, res);
    });
});

router.get('/init-super-admin', (req, res) => {
    createSuperAdmin((err, user) => {
        showResultToClient(err, user, res);
    });
});


export default router;
