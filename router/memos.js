const Memo = require('../models/memo');
const User = require('../models/user');

const {validationResult, check} = require("express-validator");
const router = require('express').Router();


//메모 생성
/*
* 201 - 메모가 생성된 경우
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

        const {memoTitle, memoContent} = req.body;
        const userId = req.params.userId;

        const user = await findByUserId(userId);
        if (user === null) {
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

            return res.status(201).send("<script>alert('메모가 작성 되었습니다.'); location.href='" + userId + "' </script>")
        } catch (e) {
            console.error(e);
        }
    });


// 메모 수정
// 200 - 메모가 성공적으로 수정된 경우
// 400 - memoTitle이나 memoContent가 비어있는 경우
// 404 - memoId나 userId를 찾을 수 없는 경우
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

        const {memoTitle, memoContent} = req.body;
        const userId = req.params.userId;
        const memoId = req.params.memoId;

        const user = await findByUserId(userId)
        if (user === null) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        let memo = await findByMemoId(memoId);
        if (memo === null) {
            return res.status(404).send({
                message: 'memoId not found'
            });
        }

        if (user.userId !== userId) {
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
                {
                    where: {memoId: memoId}
                }
            );

            memo = await findByMemoId(memoId);
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
// 404 - memoId나 userId가 없는 경우

router.delete('/delete/:memoId/:userId',
    async (req, res) => {
        console.log('dle')
        const reqError = validationResult(req);
        if (!reqError.isEmpty()) {
            return res.status(400).send({
                message: reqError.array()[0].msg
            })
        }

        const userId = req.params.userId;
        const memoId = req.params.memoId;

        const user = await findByUserId(userId)
        if (user === null) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        const memo = await findByMemoId(memoId);
        if (memo === null) {
            return res.status(404).send({
                message: 'MemoId not found'
            });
        }

        if (user.userId !== userId) {
            return res.status(409).send({
                message: 'UserID not match'
            });
        }

        try {
            await Memo.destroy(
                {where: {memoId: memoId}}
            )

        } catch (e) {
            console.error(e);
        }
    });


router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log('1',userId);
    const user = await findByUserId(userId)
    if (user === null) {
        return res.status(404).send({
            message: 'User not found'
        });
    }

    try {
        const memos = await Memo.findAll({
            attributes: [
                'memoId', 'memoTitle', 'memoContent', 'userId'
            ],
            where: {userId: userId}
        });

        return res.status(200).render('html/list', {memos});
    } catch (e) {
        console.error(e);
    }
});

//메모 상세 조회
/*
* 200 - 조회 성공
* 404 - 유저 및 메모 없음
* 409 - 유저가 쓴 메모가 아님
* */

router.get('/:memoId/:userId', async (req, res) => {

    const userId = req.params.userId;
    const memoId = req.params.memoId;

    const user = await findByUserId(userId)
    if (user === null) {
        return res.status(404).send({
            message: 'User not found'
        });
    }

    const memo = await findByMemoId(memoId);
    if (memo === null) {
        return res.status(404).send({
            message: 'Memo not found'
        });
    }

    const memoByUser = await findByUserIdAndMemoId(userId, memoId);
    if(memoByUser.length === 0){
        return res.status(409).send({
            message : 'Not a user-written note'
        })
    }

    return res.status(200).send({
        memoTitle : memo.memoTitle,
        memoContent : memo.memoContent
    });
});

const findByUserId = async (id) => {
    return await User.findByPk(id);
}

const findByMemoId = async (id) => {
    return await Memo.findByPk(id);
}

const findByUserIdAndMemoId = async (userId, memoId) => {
    return await Memo.findAll({
        where: {userId: userId, memoId: memoId}
    });
}

module.exports = router;