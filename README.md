# node开发的学生管理系统
`技术栈： Node+express+mongodb+mongoose+bootserap+jquery`

### 项目启动
`cnpm install / cnpm i`
`node app.js`

### 项目结构说明:

1. models M : 处理数据
2. controllers C : 控制器，命令模型操作数据并呈递视图
3. views V : 视图,通过ejs模板引擎渲染的页面
4. public : 存放一些资源(image,css,icon,js)
5. data : 模拟数据(需要导入到mongodb内 比如:  mongoimport -d stu -c students student.txt) 
6. route : 对路由的处理
7. 需注意管理员管理页面中的password  修改password时输入直接密码则正确,若输入md5之后的密码则错误。修改部分在Admin.js里面的changeAdmin方法中   doc.password = md5(data.password);

