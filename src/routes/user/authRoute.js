import express from "express";
import AuthSocial from "../../controllers/authSocial";
import {getUserInfo} from "../../dao/userDao";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {showResultToClient} from "../../utils/responseUtils";

var router = express.Router();

router.post('/login', (req, res) => {
    let userController = new AuthSocial(req, res);
    userController.fetchUser((err, userInfo) => {
        if (err) {
            showResultToClient(err, null, res);
        } else {
            userController.checkLoginUser(userInfo, (loginErr, userData) => {
                showResultToClient(loginErr, userData, res);
            });
        }
    });
});


router.get('/profile', authMiddleware, (req, res) => {
    let queryObj = {_id: req.user._id};
    getUserInfo(queryObj, (err, user) => {
        showResultToClient(err, user, res);
    });
});


export default router;