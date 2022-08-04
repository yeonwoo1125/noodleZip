const Memo = require('../models/memo');
const User = require('../models/user');

const { validationResult, check } = require("express-validator");
const router = require('express').Router();


//메모 생성
/*
* 400 - user을 찾을 수 없는 경우
* 404 - user을 찾을 수 없는 경우
* */
router.post('/:userId',
    [
        check('memoTitle', 'memoTitle is empty').trim().not().isEmpty(),
        check('memoContent', 'memoContent is empty').trim().not().isEmpty()
    ],
    async (req, res) => {
        const reqError = validationResult(req);
        if (!reqError.isEmpty()) {
            return res.status(400).send({
                message: reqError.array()[0].msg
            })
        }

        const { memoTitle, memoContent } = req.body;
        const userId = req.params.userId;

        if (!await findByUserId(userId)) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        try {
            const memo = await Memo.create({
                memoTitle: memoTitle,
                memoContent: memoContent,
                userId : userId
            });

            return res.status(201).send({
                "memoId": memo.memoId,
                "memoTitle": memo.memoTitle,
                "memoContent": memo.memoContent,
                "userId" : memo.userId
            })
        } catch (e) {
            console.error(e);
        }
    });
    
    
const findByUserId = async (id) => {
    return await User.findByPk(id) !== null;
}

const getUser = async (id) => {
    return await User.findByPk(id);
}

module.exports = router;