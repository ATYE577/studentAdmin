const mongoose = require('mongoose'),
    md5 = require('md5-node'),
    nodeXlsx = require('node-xlsx'),//导出为excel
    path = require('path'),
    fs = require('fs');
//1.声明schema
let adminSchema = new mongoose.Schema({
    username : String,//          用户名
    password : String,//          密码
    posttime : Number,//          注册时间
    lastLoginTime : Number//      最后一次登录时间
})
//验证用户名是否存在
adminSchema.statics.checkUser = function (user,callback){
    this.find({'username':user},(err,results)=>{
        if( err ){
            callback({t:false,val:null});
            return;
        }
        if( results.length !=0 ){
            callback({t:true,val:results[0]});
            return;
        }
        callback({t:false,val:null});
    });
}
//处理登录:
adminSchema.statics.checkLogin = function(json,callback){
    this.checkUser(json.username,function (torf){
        //{username:xxxx,password:1232sdasddsa,posttime:21312,lastLoginTime:21312}
        if( torf.t ){//用户名对了   
            if( md5(json.password) == torf.val.password ){
                callback(1); //登录成功
                //实例调用的方法是动态方法
                torf.val.changelastLoginTime();
                return;
            }
            callback(-1);//密码输入错误
        }else{
            callback(-2);//用户名不存在
        }
    })
}
//修改用户登录成功以后的登录时间
adminSchema.methods.changelastLoginTime = function(){
    var timeStemp = new Date().getTime();
    this.lastLoginTime = timeStemp;
    this.save();
}
/*获取某一页学生数据 */
adminSchema.statics.findPageData = async function (page,callbask){
    //分页
    let pageSize = 4; //一页4条数据
    let start = (page - 1) * pageSize; //起始位置
    let count = await this.find().countDocuments(); //获取数据总条数
    this.find({}).sort({'sid':-1}).skip(start).limit(pageSize).exec(function (err,results){
        if( err ){
            callbask(null);
            return;
        }
        callbask({
            results,
            length : Math.ceil(count / pageSize),//一共多少页
            count,//数据总条数
            now : page//当前在那一页
        })
    });
}
//删除学生
adminSchema.statics._delete = function(xuehao,callback){
    this.find({_id:xuehao},function(err,results){
        // console.log(results); //[{},{},{}]
        var doc = results[0];
        doc.remove((err)=>{
            if(err){
                callback({error:0,msg:"删除失败"});
                return;
            }
            callback({error:1,msg:"删除成功"});
        })
    })
 }
//修改管理员信息
adminSchema.statics.changeAdmin = function(_id,data,callback){
    this.find({_id},(err,results)=>{
        // console.log(results);[{},{},{}] 
        
        var doc = results[0];
        doc.username = data.username;
        doc.password = md5(data.password);
        doc.posttime = data.posttime;
        doc.lastLoginTime = data.lastLoginTime;
        doc.save((err)=>{
            if(err){
                callback(-1);//修改失败
                return;
            }
            callback(1);//修改成功
        })
    })
}

//增加
adminSchema.statics.saveAdmin =function(data,callback){
    // console.log(data);// {},{},{}
    //查询表里所有sid字段 _id字段会自动查询
    this.find({}).limit(1).exec(function(err,results){
        if(err){
            callback({error:0,msg:"保存失败"});
            return;
        }
        let admin = new Admin({
            // username : data.username,
            // password : md5(data.password),
            // posttime : data.posttime,
            // lastLoginTime : data.lastLoginTime  
           ...data,
           password:md5(data.password)
        });
        admin.save((err)=>{
            if(err){
                callback({error:0,msg:"保存失败"});
            }
            callback({error:1,msg:"保存成功"});
        })
    })
}

//将管理员数据导出为excel表格
adminSchema.statics.exportExcel = function(callback){
    this.find({},function(err,results){
        // console.log(results); //[{},{},{}]
        if(err) {
            callback({error:0,msg:'查询失败'});
            return;
        }
        var datas = [];//存储excel表的格式

        var col = ['_id','username','password','posttime','lastLoginTime'];//列
        datas.push(col);
        //内容
        results.forEach(function(ele){
            var arrInner = []; 
            arrInner.push(ele._id);
            arrInner.push(ele.username);
            arrInner.push(ele.password);
            arrInner.push(ele.posttime);
            arrInner.push(ele.lastLoginTime);
            datas.push(arrInner);
        });
        //将数组数据转换为底层excel表二进制数据
        var buffer = nodeXlsx.build([
            {name:'1902B管理员',data:datas}
        ]);

        // console.log(path.join(__dirname,'../'));//根目录  G:\node\StudentAdmin\
        let urlLib = path.join(__dirname,'../');
        //异步
        fs.writeFile(`${urlLib}/public/excel/admin.xlsx`,buffer,{'flag':'w'},(err)=>{
            if(err){
                callback({error:0,msg:'excel导出失败'});
                return;
            }
            callback({error:1,msg:`admin.xlsx`});
        });
    })
}
adminSchema.statics.findAdminNames = function(reg,callback){
    this.find(
        {username:{$regex:reg,$options:'$g'}},
        (err,results)=>{
            if(err){
                callback({error:0,data:null});
                return;
            }
            callback({error:1,data:results});
        }
    );
}

//2.初始化Admin类 该类会声明一个名为admins的集合
let Admin = mongoose.model('Admin',adminSchema);

//3.导出集合
module.exports = Admin;