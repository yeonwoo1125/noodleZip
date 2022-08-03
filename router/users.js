const User = require('../models/user');

const {validationResult, check} = require("express-validator");
const router = require('express').Router();
const bcrypt = require('bcrypt');


//유저 생성
/*
* 201 - 유저 생성 성공
* 400 - password가 짧거나 입력값이 하나라도 비어있는 경우
* 409 - 이미 가입된 userId인 경우
* */
router.post('/',
    [
        check('userId', 'User id is empty').trim().not().isEmpty(),
        check('userName', 'User name is empty').trim().not().isEmpty(),
        check('userPassword', 'User password is empty').trim().not().isEmpty(),
        check('userPassword', 'Password is too short').trim().isLength({min: 5})
    ],
    async (req, res) => {
        const reqError = validationResult(req);
        if (!reqError.isEmpty()) {
            return res.status(400).send({
                message: reqError.array()[0].msg
            })
        }

        const {userId, userName, userPassword} = req.body;
        const hashPw = await bcrypt.hash(userPassword, 12);

        if (await findByUserId(userId)) {
            return res.status(409).send({
                message: 'UserId is already use'
            });
        }

        try {
            const user = await User.create({
                userId: userId,
                userName: userName,
                userPassword: hashPw
            });

            return res.status(201).send({
                "userId": user.userId,
                "userName": user.userName
            })
        } catch (e) {
            console.error(e);
        }
    });

const findByUserId = async (id) => {
    return await User.findByPk(id) !== null;
}

module.exports = router;