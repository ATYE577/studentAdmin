const express = require("express");
const studentRouter2 = require('./studentRouter2.js');

//生成一个路由
let router = express.Router();
/* 处理路由访问 */

//路由请求  http://localhost:3000/student
router.use('/msg/banji',studentRouter2);

router.get('/',(req,res)=>{
    res.send('首页');
});
router.get('/:xuehao',(req,res)=>{
    res.send(req.params.xuehao);
});
// http://localhost:3000/shouye/mine
router.post('/add',(req,res)=>{
    res.send('添加');
})

module.exports = router;