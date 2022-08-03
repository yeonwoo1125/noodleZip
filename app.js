const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const mysql = require('./config/mysql');
const mysqlConn = mysql.init();
mysql.open(mysqlConn);

app.set('port', process.env.PORT || 4444);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req, res)=>{
    res.render('html/index');
});

app.listen(app.get('port'),()=>{
    console.log('http://localhost:'+app.get('port'));
});