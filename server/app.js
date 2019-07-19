var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var url='http://localhost:8000';
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var request = require('request');

var j = request.jar();
var cookie = request.cookie('JSESSIONID=B542A2B55D924B04293944424BCCE0D6');
j.setCookie(cookie,url);

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'web')))

//
// var url='http://localhost:8000/manager/workComp/selectWorkCompList';
// var obj={
//     url:url,
//     jar:j,
//     method:"post",
//     formData:{},
// };
// request(obj,function (a,b,c) {
//     console.log(a);
//     console.log(b);
//     console.log(c);
// });

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('*',function (req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');

    next();
})





app.use('/file',require('./routes/file.js'));
app.use('/details',require('./routes/details.js'));



app.use('/anhao/*',function (req,res,next) {

    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');

    console.log("-----------------------");
    // console.log(req.body);
    var url=req.originalUrl;
    url=url.replace(/\/anhao/,'');
    console.log(url);
    url='http://localhost:8080'+url;
    var obj={
        url:url,
        jar:j,
        method:"post",
        form:req.body
    };
    request(obj,function (a,b,c) {
        // console.log(a);
        // console.log(b);
        res.send(c)
        console.log(c);
    });
    // console.log(c);
    // res.send(c);
    // next(false);
});




// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;
