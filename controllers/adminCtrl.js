const Student = require('../models/Student');
const Admin = require('../models/Admin');
const formidable = require('formidable');
exports.showAdminIndex = function(req,res){
    Admin.checkUser(req.session.s_id,(adminR)=>{
        res.render('admin',{
            adminData : adminR
        });
    })
}
exports.updateAdmin = function(req,res){
    let _id= req.params._id;
    let form = formidable();//post 
    form.parse(req,(err,fields)=>{
        // console.log(fields);/
        Admin.changeAdmin(_id,fields,(results)=>{
           res.json({error:results});
        })
    })
}
//访问接口  处理管理员数据
exports.showAdminList = function(req,res){
    let page = req.query.page ? req.query.page : 1;//获取页数
    Admin.findPageData(page,function(results){
        res.json(results);
    });
}
//访问接口添加管理员页面
exports.showAddAdmin = function(req,res){
    Admin.checkUser(req.session.s_id,(adminR)=>{
        res.render('addAdmin',{
            adminData : adminR
        });
    })
}
exports.addAdmin = function(req,res){
    let form = formidable();
    form.parse(req,(err,fields)=>{
        // console.log(fields);//{ username: '温倩倩', password: 't ' }
        if(err){
            res.json({error:0,msg:'数据接收失败'});
        }
        Admin.saveAdmin(fields,(results)=>{
            // console.log(results);
            res.json(results);
        })
    })
}

exports.exportAdminToExcel = function(req,res){
    //查询所有的管理员数据:
    Admin.exportExcel((data)=>{
        console.log(data);
        res.send(data);
    })
}
exports.searchAdmin = function(req,res){
    let search = req.query.search;
    Admin.findAdminNames(search,(results)=>{
        res.json(results);
    });
}
//访问接口处理删除学生
exports.deleteAdmin = function(req,res){
    var xuehao = req.params.xuehao;
    Admin._delete(xuehao,(results)=>{
        // console.log(res);
        res.json(results);
    });
}