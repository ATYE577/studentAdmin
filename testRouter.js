const express = require("express");
const router = require('./lianxi/index.js');
const studentRouter = require('./lianxi/studentRouter.js');
var app = express();

// console.log(router);

//处理路由 当我请求 http://localhost:3000/shouye  
app.use('/login',router);//hahahha
app.use('/student',studentRouter);
/* 处理路由访问 */

app.listen(3000);

