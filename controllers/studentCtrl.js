const Student = require('../models/Student');
const Admin = require('../models/Admin');
const formidable = require('formidable');
exports.showIndex = function(req,res){
    //管理员信息  学生信息
    Admin.checkUser(req.session.s_id,(adminR)=>{
        /*报废
        Student.findPageData(page,function(studentR){
            //console.log(results);
            // adminR.val.lastLoginTime = new Date(adminR.val.lastLoginTime).toLocaleDateString();
            res.render('index',{
                adminData : adminR,
                studentData : studentR
            });
        });
        */
        res.render('index',{
            adminData : adminR
        });
    })
    // console.log(req.session);
}

//访问接口  获取某一个学生数据
exports.showList = function(req,res){
    //ajax  给前台渲染学生数据:
    let page = req.query.page ? req.query.page : 1;//获取页数
    Student.findPageData(page,function(results){
        res.json(results);
    });
}

//访问接口 处理修改学生数据
exports.updateStudent = function(req,res){
    let sid = req.params.sid;
    let form = formidable();

    form.parse(req,(err,fields)=>{
        console.log(fields);
       Student.changeStudent(sid,fields,(results)=>{
           res.json({error:results});
       })
    })

}

//通过正则做模糊搜索
exports.searchStudent = function(req,res){
    // console.log(req.query);
    let search = req.query.search;
    Student.findStudentNames(search,(results)=>{
        res.json(results);
    });
}

//访问增加学生页面
exports.showAddStudent = function(req,res){
    Admin.checkUser(req.session.s_id,(adminR)=>{
        res.render('addStudent',{
            adminData : adminR
        });
    })
}

// 访问接口处理增加学生
exports.addStudent = function(req,res){
    let form = formidable();
    form.parse(req,(err,fields)=>{
        // console.log(fields);//{ name: '傻哇你', age: '15', sex: '女' }
        if(err){
            res.json({error:0,msg:'数据接收失败'});
        }
        Student.saveStudent(fields,(results)=>{
            // console.log(results);
            res.json(results);
        })
    })
}

//访问接口处理删除学生
exports.deleteStudent = function(req,res){
    var xuehao = req.params.xuehao;
    Student._delete(xuehao,(results)=>{
        // console.log(res);
        res.json(results);
    });
}

//访问接口  处理学生数据导出
exports.exportStudentToExcel = function(req,res){
    //查询所有的学生数据:
    Student.exportExcel((data)=>{
        // console.log(data);
        res.send(data);
    })
    
}

