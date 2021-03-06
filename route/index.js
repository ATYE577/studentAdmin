//处理路由文件
const express = require('express');
const {showLogin,doLogin,checkUser} = require('../controllers/loginctrl');
const {
    showIndex:sI,
    showList:sL,
    searchStudent:sS,
    exportStudentToExcel:eSTE,
    showAddStudent:sAS,
    addStudent:aS,
    updateStudent:uS,
    deleteStudent:dS
    } = require('../controllers/studentCtrl');
const {
    showAdminIndex:sAI,
    showAdminList:aL,
    updateAdmin:uA,
    showAddAdmin:saA, 
    exportAdminToExcel:eATE,
    addAdmin:aA,
    deleteAdmin:dA,
    searchAdmin:sA
} = require('../controllers/adminCtrl');

const {Loginout} = require('../controllers/Loginout');

//生成路由
let router = express.Router();

//登录验证: 验证如果没有登陆过不能访问管理界面的任何内容
router.use((req,res,next)=>{
    if( !req.session['s_id'] && req.url !='/login' ){ //没有session 证明没有登录过
        console.log(1);
        res.send('/login');
        return;
    }
    next(); //有登录正常走下面的请求
})

//路由清单:  http:localhost:3000/
router.get('/login',showLogin); //访问登录页面 渲染登录ejs文件
router.post('/login',doLogin); //访问登录接口,处理登录操作
router.propfind('/login',checkUser); //访问接口 验证用户名是否存在

//验证用户名是否存在
router.get('/',sI); //访问首页学生管理页面  studentCtrl.showIndex
router.get('/student/msg',sL);//访问接口  处理学生数据 studentCtrl.showList)
router.get('/student/search',sS);//访问接口  处理搜索学生 studentCtrl.searchStudent
router.get('/student/addStudent',sAS);//访问添加学生页面
router.get('/student/exportExcel',eSTE);//访问接口  处理学生数据导出
router.put('/student/addStudent',aS);//访问接口  处理增加学生
router.post('/student/:sid',uS);//访问接口  并且处理修改学生数据
router.delete('/student/:xuehao',dS);//访问接口处理删除学生

//管理员
router.get('/admin',sAI); //访问管理员页面
router.get('/admin/msg',aL);//访问接口  处理管理员数据
router.get('/admin/addAdmin',saA);//访问添加管理员页面
router.put('/admin/addAdmin',aA);//访问接口  处理增加管理员
router.get('/admin/exportExcel',eATE);//访问接口 
router.get('/admin/search',sA);//访问接口 
router.delete('/admin/:xuehao',dA);//访问接口删除管理员

router.post('/admin/:_id',uA);//访问接口 并且处理修改管理员数据



//访问接口 处理退出
router.get('/Loginout',Loginout); 

module.exports = router;


//svg-captcha  做验证码之类的