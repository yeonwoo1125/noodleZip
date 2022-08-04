const Memo = require('../models/memo');
const User = require('../models/user');

const { validationResult, check } = require("express-validator");
const router = require('express').Router();


//메모 생성
/*
* 400 - 값이 비어있는 경우
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
                userId: userId
            });

            return res.status(201).send({
                "memoId": memo.memoId,
                "memoTitle": memo.memoTitle,
                "memoContent": memo.memoContent,
                "userId": memo.userId
            })
        } catch (e) {
            console.error(e);
        }
    });



// 메모 수정
// 200 - 메모가 성공적으로 수정된 경우
// 404 - user을 찾을 수 없는 경우
// 409 - userId가 일치하지 않는 경우

router.put('/:memoId/:userId',
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
        const memoId = req.params.memoId;

        if (!await findByUserId(userId)) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        const user = await getUser(userId)

        if (user.userId != userId) {
            return res.status(409).send({
                message: 'UserID not match'
            });
        }

        try {
            await Memo.update(
                {
                    memoTitle: memoTitle,
                    memoContent: memoContent
                },
                { where: { memoId: memoId } }
            );
            const memo = await Memo.findByPk(memoId)

            return res.status(200).send({
                "memoId": memo.memoId,
                "memoTitle": memo.memoTitle,
                "memoContent": memo.memoContent
            })
        } catch (e) {
            console.error(e);
        }
    });


// 메모 삭제
// 200 - 메모가 성공적으로 삭제된 경우
// 404 - user을 찾을 수 없는 경우

router.delete('/:memoId/:userId',

    async (req, res) => {
        const reqError = validationResult(req);
        if (!reqError.isEmpty()) {
            return res.status(400).send({
                message: reqError.array()[0].msg
            })
        }

        const userId = req.params.userId;
        const memoId = req.params.memoId;

        if (!await findByUserId(userId)) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        const user = await getUser(userId)

        if (user.userId != userId) {
            return res.status(409).send({
                message: 'UserID not match'
            });
        }

        try {
            await Memo.destroy(
                { where: { memoId: memoId } }
            )
                                            
            return res.status(200);
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