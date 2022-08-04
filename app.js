const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const {sequelize} = require('./models/index');
const userRouter = require('./router/users');
const memoRouter = require('./router/memos');

app.set('port', process.env.PORT || 4444);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

//이미지, css 폴더
app.use('/', express.static("./public/css"));
app.use('/', express.static("./public/img"));
app.use('/users', userRouter)
app.use('/memos', memoRouter)

//인덱스
app.get('/', (req, res) => {
    res.render('html/index');
});
//로그인
app.get('/login', (req, res) => {
    res.render('html/login');
});
//회원가입
app.get('/join', (req, res) => {
    res.render('html/join');
});
// 메모 쓰기
app.get('/memo', (req, res) => {
    res.render('html/memo');
});
// 메모리스트
app.get('/list', (req, res) => {
    res.render('html/list');
});

app.listen(app.get('port'), () => {
    console.log('http://localhost:' + app.get('port'));
});

