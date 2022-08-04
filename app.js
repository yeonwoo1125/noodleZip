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

app.use('/users', userRouter)
app.use('/memos', memoRouter)

app.get('/', (req, res) => {
    res.render('html/index');
});

app.listen(app.get('port'), () => {
    console.log('http://localhost:' + app.get('port'));
});

