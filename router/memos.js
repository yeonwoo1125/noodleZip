const Memo = require('../models/memo');

const {validationResult, check} = require("express-validator");
const router = require('express').Router();


//유저 생성
/*
* 201 - 유저 생성 성공
* 400 - password가 짧거나 입력값이 하나라도 비어있는 경우
* 409 - 이미 가입된 userId인 경우
* */
router.post('/',
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

        const {memoTitle, memoContent} = req.body;
        const userId = req.params.userId;

        if (!await findByUserId(userId)) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        try {
            const memo = await Memo.create({
                memoTitle: memoTitle,
                memoContent: memoContent
            });

            return res.status(201).send({
                "memoId": memo.memoId,
                "memoTitle": memo.memoTitle,
                "memoContent": memo.memoContent
            })
        } catch (e) {
            console.error(e);
        }
    });


const findByUserId = async (id) => {
    return await User.findByPk(id) !== null;
}

module.exports = router;