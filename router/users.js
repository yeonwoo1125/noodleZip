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
            return res.status(400).send("<script>alert('비밀번호가 짧거나 입력값이 비어 있습니다.'); history.back(); </script>")
        }

        const {userId, userName, userPassword} = req.body;
        const hashPw = await bcrypt.hash(userPassword, 12);

        if (await findByUserId(userId)) {
            return res.status(409).send("<script>alert('이미 가입된 아이디 입니다.'); history.back(); </script>");
        }
        try {
            await User.create({
                userId: userId,
                userName: userName,
                userPassword: hashPw
            });
            return res.status(201).send("<script>alert('회원가입이 완료 되었습니다.'); location.href='../login' </script>")
        } catch (e) {
            console.error(e);
        }
    });


//유저 로그인
/*
* 200 - 로그인 성공
* 401 - 비밀번호 틀림
* 404 - 유저 아이디 없음
* */

router.post('/login', async (req, res) => {
    const {userId, userPassword} = req.body;

    const user = await findByUserId(userId);
    if (user === null) {
        return res.status(404).send("<script>alert('해당하는 유저가 존재하지 않습니다.'); history.back(); </script>")
    }

    bcrypt.compare(userPassword, user.userPassword, (err, same) => {
        if (same) {
            req.session.userName = user.userName;
            req.session.userId = user.userId;
            req.session.save();

            return res.status(200).redirect('/memos/' + req.session.userId)
        } else {
            return res.status(401).send("<script>alert('로그인에 실패하였습니다.'); history.back();</script>")
        }
    });
});

const findByUserId = async (id) => {
    return await User.findByPk(id);
}

module.exports = router;