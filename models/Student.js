const mongoose = require('mongoose');
const nodeXlsx = require('node-xlsx');//导出为excel
const path = require('path');
const fs = require('fs');
//1.声明schema
let studentSchema = new mongoose.Schema({
    sid : Number,//        学号
    name : String,//       姓名
    sex : String,//        性别
    age : Number,//        年龄
})
/*获取某一页学生数据 */
studentSchema.statics.findPageData = async function (page,callbask){
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
//修改学生信息
studentSchema.statics.changeStudent = function(sid,data,callback){
    this.find({sid},(err,results)=>{
        // console.log(results);
        var doc = results[0];
        doc.name = data.uname;
        doc.sex = data.sex;
        doc.age = data.age;
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
studentSchema.statics.saveStudent =function(data,callback){
    //查询表里所有sid字段 _id字段会自动查询
    this.find({},{sid:1}).sort({sid:-1}).limit(1).exec(function(err,results){
        //console.log(data); {},{},{} 前台传给后台的数据   { name: '傻哇你', age: '15', sex: '女' }
        // console.log(results); //[{},{},{}] 
        //[{ _id: 5eaa76841b6b729f72468832, sid: 100010 }]  results[0]['sid']+1;
       
        if(err){
            callback({error:0,msg:"保存失败"});
            return;
        }

        let sid =  results.length > 0 ? Number(results[0]['sid']) + 1 : 100001;//设置学号 sid
        let student = new Student({
            sid,
            ...data
        });
        student.save((err)=>{
            if(err){
                callback({error:0,msg:"保存失败"});
            }
            callback({error:1,msg:"保存成功"});
        })
    })
}
//删除学生
studentSchema.statics._delete = function(xuehao,callback){
   this.find({sid:xuehao},function(err,results){
        //console.log(results); [{},{},{}]
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

//将学生数据导出为excel表格
studentSchema.statics.exportExcel = function(callback){
    this.find({},function(err,results){
        // console.log(results); //[{},{},{}]
        if(err) {
            callback({error:0,msg:'查询失败'});
            return;
        }
        var datas = [
            // ['_id','sid','name','sex','age'],
            // ['sdsf','10001','温倩倩','女','19'],
            // ['sdsf','10002','小祖宗','女','20']
        ];//存储excel表的格式

        var col = ['_id','sid','name','sex','age'];//列
        // for( i in results[0] ){
        //     col.push(i);
        // }
        datas.push(col);
        //内容
        results.forEach(function(ele){
            var arrInner = []; 
            arrInner.push(ele._id);
            arrInner.push(ele.sid);
            arrInner.push(ele.name);
            arrInner.push(ele.sex);
            arrInner.push(ele.age);
            datas.push(arrInner);
        });
        //将数组数据转换为底层excel表二进制数据
        var buffer = nodeXlsx.build([
            {name:'1902',data:datas},
            // {name:'1906-D1',data:datas}//可以有 多个sheet
        ]);
        // console.log(datas);[[],[],[]]

        // console.log(path.join(__dirname,'../'));//根目录  G:\node\StudentAdmin\
        let urlLib = path.join(__dirname,'../');
        //异步
        // fs.writeFile(`${__dirname}/excel/class.xlsx`,buffer,{'flag':'w'},(err)=>{
        fs.writeFile(`${urlLib}public/excel/class.xlsx`,buffer,{'flag':'w'},(err)=>{
            if(err){
                callback({error:0,msg:'excel导出失败'});
                return;
            }
            // callback({error:1,msg:`${__dirname}/excel/class.xlsx`});
            callback({error:1,msg:`class.xlsx`});
        });
    })
}
studentSchema.statics.findStudentNames = function(reg,callback){
    // let val = new RegExp(reg,'g');  {name:val}
    // let val = eval(`/${reg}/g`);  {name:val}
    this.find(
        {name:{$regex:reg,$options:'$g'}},
        (err,results)=>{
            if(err){
                callback({error:0,data:null});
                return;
            }
            // console.log(results);  [{},{}]
            callback({error:1,data:results});
        }
    );
}
//2.初始化Student类 该类会声明一个名为students的集合
let Student = mongoose.model('Student',studentSchema);

//3.导出集合
module.exports = Student;