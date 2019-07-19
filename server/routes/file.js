var express = require('express');
const query=require('./mysql');
var router = express.Router();
const multer = require('multer');
const AdmZip = require('adm-zip'); //引入查看zip文件的包
var xlsx = require('node-xlsx');
var textract = require('textract');//对于docx文件，您可以使用textract，它将从.docx文件中提取文本。
var fs = require('fs');


var upload = multer({
    dest: '../public'
});//定义图片上传的临时目录
/* GET users listing. */

router.post('/getStudyTime', upload.array('file', 9), function (req, res, next) {      //获取正确的时间表
    var file=req.files;
    for (var i = 0; i < req.files.length; i++) {
        // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
        // 对临时文件转存，fs.rename(oldPath, newPath,callback);
        let num = new Date().getTime() + i;
        let newPath = "/establishment/" + req.files[i].originalname + num + ".xlsx";
        fs.rename(req.files[i].path, "public/establishment/" + req.files[i].originalname + num + ".xlsx", function (err) {
            // console.log(newPath);
            var obj = xlsx.parse("public" + newPath);
            // console.log(JSON.stringify(obj));
            var data=obj[0].data;
            for(let i=1;i<data.length;i++){
                let projectNum=data[i][0].replace(/RD0/,'RD');
                let projectName=data[i][i];
                let studyTime=data[i][2]

                let sql=`UPDATE establishment
                SET project_time = '${studyTime}'
                WHERE
                project_num = '${projectNum}'`;
                query(sql,function (data) {
                    if(data.affectedRows>0){
                        console.log('更新时间成功');
                    }
                })

            }
            res.send({
                data:obj
            })
        })
    }
});




router.post('/incomdetails', upload.array('file', 9), function (req, res, next) {      //这个是费用明细表
    var file=req.files;

    for (var i = 0; i < req.files.length; i++) {
        // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
        // 对临时文件转存，fs.rename(oldPath, newPath,callback);
        let num = new Date().getTime() + i;
        let newPath = "/establishment/" + req.files[i].originalname + num + ".xlsx";
        fs.rename(req.files[i].path, "public/establishment/" + req.files[i].originalname + num + ".xlsx", function (err) {
            // console.log(newPath);
            var obj = xlsx.parse("public" + newPath);

            res.send({
                data:obj
            })
            //此处有很多张表/我们只取想要的表
            for(let i=0;i<obj.length;i++){
                // console.log(obj[i]);
                // console.log(obj[i].name);
                let sheetName=obj[i].name;
                // console.log(sheetName);
                let data=obj[i].data;

                if(sheetName.indexOf('研发费用')!=-1&&sheetName.indexOf('(')==-1&&sheetName.match(/\d+/)!=null) {
                    //说明这就是一张有用的表;
                    console.log(sheetName);
                    let years = sheetName.match(/\d+/);
                    years = years.length < 3 ? '20' + years : years;//这张表的年份
                    console.log(data[2]);
                    let projectList = data[2];   //这就是这一年的所有的项目名称;
                    projectList.pop();
                    projectList.shift()
                    let studyCostCount = data[14];  //研发费用小计;
                    studyCostCount.pop();
                    studyCostCount.shift();

                    let doneNum = 0;
                    for (let a = 0; a < projectList.length; a++) {
                        let projectName=projectList[a].replace(/RD0/,'RD')
                        let studyCost=parseFloat(studyCostCount[a]).toFixed(2)
                        let sql = `INSERT INTO study_cost (years,project_name,study_cost_count) VALUES ("${years}", "${projectName}", "${studyCost}")`;
                        query(sql, function (data) {
                            if (data.affectedRows === 1) {
                                console.log("插入完成:" + projectList[a]);
                            }
                        })
                    }
                }
            }

        })
    }
});



router.post('/files', upload.array('file', 9), function (req, res, next) {      //这个是项目书
    var file=req.files;
    var list=[]
    for (var i = 0; i < req.files.length; i++) {
        // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
        // 对临时文件转存，fs.rename(oldPath, newPath,callback);
        let num = new Date().getTime() + i;
        let filename=req.files[i].originalname;
        let newPath = "/establishment/" + req.files[i].originalname + num + ".xlsx";
        fs.rename(req.files[i].path, "public/establishment/" + req.files[i].originalname + num + ".xlsx", function (err) {
            // console.log(newPath);
            var obj = xlsx.parse("public" + newPath);
            // setTimeout(function () {
            //     res.send(obj)
            // },2000)

            list.push(obj)
            // console.log(JSON.stringify(obj));
            //obj是获取到的excel的数据;
            let data=obj[0].data;

            if(data[0][0].indexOf('项目编号')===-1){   //说明这个是在表格中有项目编号的

                for(let a=0;a<data.length;a++){

                    let list=data[a];
                    for(let b=0;b<list.length;b++){

                        if(!list[b]||typeof list[b]!='string'){
                            continue
                        }
                        if(list[b].indexOf("RD")!==-1){
                            var projectNum=list[b].replace(/RD0/,'RD');//项目编号
                            console.log("项目编号是:" + projectNum);
                            continue
                        }
                        if(list[b].indexOf("项目名称")!==-1){
                            var  projectName=list[b+1]; //项目名称
                            console.log("项目名称是:" + projectName);
                            continue
                        }

                        if(list[b].indexOf("技术来源")!==-1){
                            var origin=list[b+1]   //技术来源
                            console.log("技术来源是:" + origin);
                            continue
                        }
                        if(list[b].indexOf('年')!==-1&&list[b].indexOf('月')!==-1&&list[b].indexOf('日')!==-1){
                            var projectResult=list[b];//项目阶段性成果;
                            console.log("项目阶段性成果是:" + projectResult);
                        }

                        if(list[b].indexOf('核心技术及')!==-1){
                            let data1=list[b+1]
                            data1=data1.indexOf("核心")===-1?'核心技术:'+data1:data1;
                            let data2=data[a+1][1]
                            data2.indexOf("创新")===-1?"创新点:"+data2:data2;
                            var mainPoint=data1+data2;//核心技术及创新点
                            console.log("核心技术及创新点:" + mainPoint);
                            continue

                        }
                        if(list[b].indexOf('立项目的及')!==-1){      //立项组织及目的
                            var projectPurpose=list[b+1]+data[a+1][1]
                        }
                    }
                }

            }else {     //说明这个是没有项目编号的

                for(let a=0;a<data.length;a++){

                    let list=data[a];
                    for(let b=0;b<list.length;b++){
                        if(!list[b]||typeof list[b]!='string'){
                            continue
                        }

                        if(list[b].indexOf("RD")!==-1){
                            var projectNum=list[b].replace(/RD0/,'RD');//项目编号
                            var lastIndex=projectNum.lastIndexOf(":")===-1?projectNum.lastIndexOf("："):projectNum.lastIndexOf(":");
                            projectNum=projectNum.substr(lastIndex+1);
                            projectNum
                            continue
                        }
                        if(list[b].indexOf("项目名称")!==-1){
                            var  projectName=list[b+1]; //项目名称
                            console.log("项目名称是:" + projectName);
                            continue
                        }

                        if(list[b].indexOf("技术来源")!==-1){
                            var origin=list[b+1];   //技术来源
                            console.log("技术来源是:" + origin);
                            continue
                        }
                        if(list[b].indexOf('年')!==-1&&list[b].indexOf('月')!==-1&&list[b].indexOf('日')!==-1){
                            var projectResult=list[b];//项目阶段性成果;
                            console.log("项目阶段性成果是:" + projectResult);
                        }

                        if(list[b].indexOf('核心技术及')!==-1){

                            let data1=data[a+1][1];
                            data1=data1.indexOf("核心")===-1?'核心技术:'+data1:data1;
                            let data2=data[a+3][1];
                            data2.indexOf("创新")===-1?"创新点:"+data2:data2;
                            var mainPoint=data1+data2;//核心技术及创新点
                            console.log("核心技术及创新点:" + mainPoint);
                            continue

                        }
                        if(list[b].indexOf('立项目的及')!==-1){      //立项组织及目的
                            var projectPurpose=list[b+1]+data[a+1][1]
                        }
                    }
                }

            }



            let sql = `INSERT INTO establishment(filename,project_name,project_num,origin,project_purpose,main_point,project_result) VALUES ("${filename}","${projectName}","${projectNum}","${origin}","${projectPurpose}","${mainPoint}","${projectResult}")`;
            query(sql, function (data) {
                console.log(data);
                if (data.affectedRows === 1) {
                    console.log("插入一个项目");

                }
            })



            // res.send({
            //     data:obj
            // });


        })
    }


    setTimeout(function () {
        res.send(list);
    },2000)




});



router.post('/file', upload.array('file', 9), function (req, res, next) {

    // let date=new Date().getTime();
    // console.log(date);
    console.log(req.body);
    console.log(req.files);






    // console.log(1111111111111111111);
    //
    // textract.fromFileWithPath( "public/establishment/RD13-油箱涂装传送轨道的研发.doc1563345043858.doc", function (error, text) {
    //
    //     console.log(error);
    //     console.log(text);
    //     res.send(text);
    //
    //
    // });
    //
    // console.log(1111111111111);


    var file=req.files;

    for (var i = 0; i < req.files.length; i++) {
        // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
        // 对临时文件转存，fs.rename(oldPath, newPath,callback);
        let num = new Date().getTime() + i;
        let newPath = "/establishment/" + req.files[i].originalname + num + ".doc";
        fs.rename(req.files[i].path, "public/establishment/" + req.files[i].originalname + num + ".doc", function (err) {
            console.log(newPath);
            // let sql = `INSERT INTO sharingimg(sharingid,imgurl) VALUES ("${targetId}","${newPath}")`;
            // query(sql, function (data) {
            //     // console.log(data);
            // })







            textract.fromFileWithPath("public"+newPath, function (error, text) {

                console.log(text);
                res.send({
                    text:text
                })

            })



        })
    }




    return false;
    // let sql = `INSERT INTO establishment(userid,content,sharingvisible) VALUES ("${userId}","${content}","${sharingvisible}")`;
    query(sql, function (data) {
        // console.log(data);
        if (data.affectedRows === 1) {
            let targetId = data.insertId;
            for (var i = 0; i < req.files.length; i++) {
                // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
                // 对临时文件转存，fs.rename(oldPath, newPath,callback);
                let num = new Date().getTime() + i;
                let newPath = "/establishment/" + req.files[i].originalname + num + ".doc";
                fs.rename(req.files[i].path, "public/establishment/" + req.files[i].originalname + num + ".doc", function (err) {
                    console.log(newPath);
                    let sql = `INSERT INTO sharingimg(sharingid,imgurl) VALUES ("${targetId}","${newPath}")`;
                    query(sql, function (data) {
                        // console.log(data);
                    })
                })
            }
            res.send("ok")
        }
    })
});

module.exports = router;
