/* 处理路由访问 */
const express = require("express");

let router = express.Router();

//路由请求  http://localhost:3000/shouye/news
router.get('/news',(req,res)=>{
    res.send('hahaha');
});
// http://localhost:3000/shouye/mine
router.get('/mine',(req,res)=>{
    res.send('我的');
})
//post请求 /login
// router.post('/',(req,res)=>{
//     res.send('登录');
// })

module.exports = router;